# Louve Invest — Le marché secondaire des SCPI (Primopierre)

Application web d'analyse d'opportunités, de simulation de rendement et de préparation d'ordres d'achat sur le marché secondaire des SCPI à capital fixe (étude de cas : **SCPI Primopierre** — **Praemia REIM France**).

---

## 1. Lancement rapide en local

### Prérequis
- **Node.js** `>= 20`
- **Yarn** `1.22+`
- Base de données **PostgreSQL** (locale ou distante via `DATABASE_URL`)

### Installation et démarrage

```bash
# 1. Installer les dépendances
yarn install

# 2. Configurer les variables d'environnement
cp .env.example apps/web/.env
cp .env.example packages/database/.env
# Renseigner DATABASE_URL et DIRECT_URL dans ces fichiers .env

# 3. Générer le client Prisma et synchroniser le schéma PostgreSQL
yarn db:generate
yarn db:push

# 4. Lancer le serveur de développement
yarn dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).
Au premier chargement (si la base est vide), l'application récupère automatiquement les données de marché en direct depuis la page officielle de **Praemia REIM** et les persiste en base PostgreSQL. Un bouton **« Actualiser les données »** permet de relancer la synchronisation à tout moment.

---

## 2. Fonctionnalités implémentées

| Étape | Fonctionnalité du sujet | Détails de l'implémentation |
| :--- | :--- | :--- |
| **01** | **Analyser les opportunités du marché secondaire** (`/`) | Scraping automatisé (Cheerio) du dernier prix d'exécution (`31,88 €`), du dernier prix acquéreur (`35,00 €`), de la valeur de réalisation (`70,76 €` soit `-50,5 %` de décote acquéreur), des dates de confrontation/limite d'ordres, du **carnet d'ordres (Top 5 achat / Top 5 vente)** avec détection automatique des croisements et calcul du coût acquéreur sur les offres de vente, et de l'**historique complet des confrontations**. |
| **02** | **Consulter le rendement frais inclus + Bonus frais fixes** (`/estimation`) | Calcul détaillé du rendement brut frais proportionnels inclus (`13,03 %` sur la base du dividende 2025 de `4,56 € / part` et de `9,80 %` de frais proportionnels). **Bonus réalisé :** simulateur interactif intégrant les frais fixes de dossier (`60 € TTC`, `90 € TTC` ou saisie libre) selon le prix d'acquisition et le nombre de parts souhaités, avec passerelle directe vers la préparation d'achat. |
| **03** | **Estimer la prochaine confrontation + Bonus graphique** (`/estimation?tab=03`) | Algorithme de fixing déterminant le prix d'équilibre et le volume échangeable maximal à partir du carnet d'ordres cumulé, tableau détaillé niveau par niveau et explicitation des hypothèses/limites. **Bonus réalisé :** graphique interactif de sensibilité du rendement en fonction du prix d'exécution sur un intervalle paramétrable (avec superposition de l'impact des frais fixes). |
| **04** | **Préparer un email à la société de gestion** (`/purchase`) | Parcours guidé avec validation temps réel (`react-hook-form` + `zod`) : nom, prénom, statut d'associé (et numéro d'associé conditionnel), nombre de parts, prix maximum par part (hors frais) avec boutons de sélection rapide (*Dernier exécuté*, *Équilibre estimé*, *Meilleure limite vendeuse*), récapitulatif financier et génération de l'email prêt à copier ou à ouvrir dans le client mail (`mailto:`). |

---

## 3. Architecture et choix techniques

Pour optimiser les **4 heures** imparties et concentrer l'effort sur la justesse financière et l'UX investisseur, je suis parti de mon socle monorepo **Turborepo + Next.js (App Router) + TypeScript strict** :

- **`apps/web`** : Application Next.js 16 (React Server Components par défaut, Server Actions pour le rafraîchissement du marché, routes `/`, `/estimation`, `/purchase`).
- **`packages/my-functions`** : Moteur métier pur et sans effet de bord (calculs de décote, décomposition du rendement, simulation frais fixes inclus, algorithme de confrontation et génération de l'email).
- **`packages/my-zod`** : Schémas de validation Zod (validation du formulaire client et validation de contrat des entrées scrapées) et interfaces TypeScript partagées.
- **`packages/database`** : Schéma Prisma (`Scpi`, `OrderBookEntry`, `ConfrontationHistory`) découplant la lecture client de la disponibilité temps réel du site de Praemia REIM.
- **`packages/my-components` & `packages/ui`** : Composants atomiques et sections métier découplés de la couche de récupération des données.

### Extensibilité à d'autres SCPI / Sociétés de gestion
- Le modèle de données `Scpi` stocke les taux de frais (`transferCommissionRateTtc`, `registrationTaxRate`, `fixedFolderFeeTtc`), le dividende de référence (`previousYearDividend`, `dividendYear`, `dividendSource`) et la société de gestion (enum Prisma `ManagementCompany`).
- Les métadonnées statiques (libellé, catégorie, URL source, frais du mandat d'achat) sont centralisées dans `packages/my-zod` sous forme de `Record<TScpiName, …>` (`scpiNameToLabel`, `scpiNameToCategory`, `scpiNameToSourceUrl`, `scpiNameToMandateFolderFeeTtc`), et la société de gestion via `managementCompanyToLabel` / `managementCompanyToEmail` / `managementCompanyToScpiList`. TypeScript impose de renseigner chaque entrée lors de l'ajout d'une SCPI ou d'une société.
- La synchronisation (`apps/web/utils/syncScpiMarketData.ts`) s'appuie sur un **registre de connecteurs typé par `TScpiName`** (`SCPI_SCRAPERS_REGISTRY`), permettant d'ajouter une nouvelle SCPI en implémentant un connecteur retournant l'interface standardisée `IScpiScrapedMarketData`.

---

## 4. Sources, formules financières et hypothèses métier

### Sources réglementaires utilisées pour Primopierre
1. **Données de marché temps réel :** [Page officielle Praemia REIM — SCPI Primopierre](https://www.praemiareim.fr/fr/scpi-primopierre) (carnet d'ordres Top 5, historique des confrontations depuis le passage en capital fixe en mars 2026, valeur de réalisation de `70,76 €`, capitalisation, TOF).
2. **Dividende annuel brut 2025 :** **`4,56 € / part`** en pleine propriété (source : *Rapport Annuel 2025* et *Bulletin Trimestriel d'Information T2 2026* de Praemia REIM France).
3. **Frais d'acquisition sur le marché secondaire :**
   - **Commission de cession de la société de gestion :** `4,00 % HT` soit **`4,80 % TTC`** (TVA 20 %).
   - **Droits d'enregistrement (Trésor Public) :** **`5,00 %`** (art. 726 du CGI).
   - **Total des frais proportionnels :** **`9,80 %`** ajoutés au prix d'exécution net vendeur :
     $$\text{Prix acquéreur hors frais fixes} = \text{Prix d'exécution} \times (1 + 0,048 + 0,05) = \text{Prix d'exécution} \times 1,098$$
   - **Rendement frais inclus (hors frais fixes) :**
     $$\text{Rendement frais inclus} = \frac{\text{Dividende brut}_{2025}}{\text{Prix d'exécution} \times 1,098} = \frac{4,56}{31,88 \times 1,098} \approx 13,03\,\%$$
4. **Subtilité sur les frais fixes de dossier (Bonus) :**
   - La documentation officielle de Praemia REIM mentionne un forfait fixe par dossier de **`50,00 € HT` (`60,00 € TTC`)** dans la *Note d'information (Août 2026, p. 24)* et le *BTI 2T 2026*, et de **`75,00 € HT` (`90,00 € TTC`)** dans le *Mandat d'achat sur le marché secondaire (p. 4)*, applicable juridiquement aux cessions directes de gré à gré et mutations.
   - Afin de répondre pleinement au bonus facultatif et d'illustrer l'amortissement des frais fixes selon le ticket d'investissement, le simulateur permet de basculer en un clic entre **`60,00 € TTC`**, **`90,00 € TTC`**, **`0,00 €`** (confrontation stricte) ou un montant libre :
     $$\text{Rendement frais fixes inclus} = \frac{N \times \text{Dividende brut}_{2025}}{N \times \text{Prix d'acquisition} \times 1,098 + \text{Forfait fixe TTC}}$$

### Algorithme d'estimation de la prochaine confrontation
Conformément aux règles de fixing des SCPI à capital fixe (*Note d'information Primopierre, Chapitre II §3.G*), l'algorithme évalue chaque niveau de prix candidat $P$ présent dans le carnet :
- **Demande cumulée à $P$ :** somme des parts des ordres d'achat dont la limite vendeur est $\ge P$.
- **Offre cumulée à $P$ :** somme des parts des ordres de vente dont la limite vendeur est $\le P$.
- **Volume échangeable à $P$ :** $\min(\text{Demande cumulée}(P), \text{Offre cumulée}(P))$.

Le prix d'équilibre retenu est déterminé selon **3 critères hiérarchiques** :
1. **Critère 1 (Maximisation du volume) :** prix maximisant le nombre de parts échangeables.
2. **Critère 2 (Minimisation du déséquilibre résiduel) :** en cas d'égalité sur le volume maximal, sélection du prix minimisant le reliquat non échangé $|\text{Demande cumulée}(P) - \text{Offre cumulée}(P)|$.
3. **Critère 3 (Continuité des cours) :** en cas d'égalité persistante, sélection du prix le plus proche du dernier prix d'exécution constaté (`31,88 €`), puis du prix le plus élevé en cas d'équidistance.

---

## 5. Limites connues de l'estimation

Ces limites sont également explicitées directement dans l'interface client (`ConfrontationHypothesesCard`) :
1. **Profondeur du carnet limitée au Top 5 :** Praemia REIM ne publie que les 5 meilleures limites d'achat et les 5 meilleures limites de vente. Les ordres situés au-delà de ces 5 lignes ne sont pas visibles.
2. **Photographie avant cut-off :** Le carnet évolue jusqu'à la date limite de réception des ordres (fixée à l'avant-veille de la confrontation à 16h00). De nouveaux ordres d'achat ou de vente d'ici l'échéance déplaceront le point d'équilibre.
3. **Délai administratif d'inscription :** Seuls les ordres complets et couverts par les fonds reçus apparaissent au registre, ce qui crée un décalage de quelques jours ouvrés.
4. **Agrégation par limite de prix :** Les lignes publiées agrègent plusieurs ordres sans préciser leur horodatage individuel (règle du *premier inscrit, premier servi* sur le reliquat) ni d'éventuelles conditions d'exécution *« tout ou rien »*.

---

## 6. Temps consacré et utilisation de l'IA

- **Temps consacré :** **4h30** (réparties entre l'analyse du sujet et des documents officiels de Praemia REIM, le cadrage architectural, le pilotage par prompting de l'agent IA, la revue critique des propositions et les tests de validation).
- **Utilisation de l'IA :** **100 %** — **Je n'ai pas touché une seule ligne de code.** L'intégralité du codebase (modélisation Prisma, scrapers, calculs financiers, formulaires, composants UI et tests) a été rédigée de manière autonome par l'IA sous ma supervision, mon rôle s'étant concentré sur le guidage itératif.

### Exemple concret d'arbitrage et de cadrage de l'IA

Lors de la conception de l'algorithme d'estimation du prix de confrontation (`estimateNextConfrontation`) et de la modélisation des frais d'acquisition :

* **Proposition initiale de l'agent IA :** L'assistant proposait de départager deux prix d'équilibre ex-æquo en volume par une simple moyenne arithmétique, hésitait sur l'assiette HT/TTC de la commission de cession (4 % HT vs 4,80 % TTC) et appliquait un forfait unique de frais fixes en dur sans distinguer les modalités de cession.
* **Vérification et instructions de correction transmises à l'IA :**
  1. **Validation des frais variables par les données réelles :** En recoupant le carnet d'ordres et l'historique sur la page Praemia REIM (dernier prix net vendeur de 31,88 € pour un prix acquéreur de 35,00 €, soit un coefficient de $\times 1,098$), j'ai fait constater à l'IA que les frais proportionnels s'élèvent bien à **9,80 %** : **4,80 % TTC** de commission de cession (4 % HT + TVA 20 %) + **5,00 %** de droits d'enregistrement.
  2. **Règle réglementaire de confrontation (Note d'information Primopierre) :** J'ai fait écarter la moyenne arithmétique pour faire implémenter par l'IA les critères officiels de départage en cas d'égalité sur le volume maximal échangé : maximisation du volume échangé $\rightarrow$ minimisation du reliquat non servi ($\lvert \text{Demande} - \text{Offre} \rvert$) $\rightarrow$ proximité avec le dernier prix d'exécution constaté.
  3. **Adaptation du simulateur de frais fixes (Bonus) :** En confrontant le BTI (50 € HT / 60 € TTC par dossier) et le Mandat d'achat (75 € HT / 90 € TTC), j'ai relevé que ces frais fixes s'appliquent juridiquement aux cessions de gré à gré chez Praemia REIM. J'ai donc demandé à l'IA d'adapter l'interface pour proposer un sélecteur explicite (**60 € TTC / 90 € TTC / 0 €** + saisie libre) afin de répondre à l'exercice sur l'amortissement des frais fixes tout en respectant la réalité contractuelle de la SCPI.
