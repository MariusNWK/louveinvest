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
