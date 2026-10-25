import { formatEuroPrice } from "my-functions";
import { type IScpiWithMarketRelations, managementCompanyToLabel } from "my-zod";
import { AlertTriangle, CheckSquare } from "react-feather";
import { CardTitle } from "ui";

export interface IConfrontationHypothesesCardProps {
  scpi: IScpiWithMarketRelations;
}

export function ConfrontationHypothesesCard(props: IConfrontationHypothesesCardProps) {
  const scpi = props.scpi;
  const managementCompanyLabel = managementCompanyToLabel[scpi.managementCompany];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-xl border border-louve-blue-border bg-louve-blue-soft/40 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-louve-blue-soft text-louve-blue">
            <CheckSquare size={15} />
          </div>
          <CardTitle>Hypothèses de calcul &amp; règles de fixing ({managementCompanyLabel})</CardTitle>
        </div>

        <ul className="flex flex-col gap-2.5 text-louve-slate text-xs leading-relaxed">
          <li>
            <strong className="text-louve-navy">1. Maximisation du volume échangé (Critère 1) :</strong> conformément au
            Chapitre II §3.G de la Note d&apos;information, le prix d&apos;exécution est celui qui maximise{" "}
            <code className="rounded bg-louve-surface px-1 py-0.5 text-louve-navy">
              min(Demande cumulée ≥ P, Offre cumulée ≤ P)
            </code>
            .
          </li>
          <li>
            <strong className="text-louve-navy">2. Minimisation du reliquat non échangé (Critère 2) :</strong> lorsque
            plusieurs prix candidats permettent d&apos;échanger exactement le même volume maximal de parts, la règle
            réglementaire retient le prix laissant le plus faible déséquilibre résiduel{" "}
            <code className="rounded bg-louve-surface px-1 py-0.5 text-louve-navy">
              |Demande cumulée − Offre cumulée|
            </code>
            .
          </li>
          <li>
            <strong className="text-louve-navy">3. Proximité au dernier prix d&apos;exécution (Critère 3) :</strong> en
            cas d&apos;égalité persistante sur les deux premiers critères, le prix retenu est le plus proche du dernier
            prix d&apos;exécution établi ({formatEuroPrice(scpi.lastExecutionPrice)}), puis le prix le plus élevé en cas
            d&apos;équidistance.
          </li>
          <li>
            <strong className="text-louve-navy">4. Exécution partielle autorisée :</strong> tous les ordres sont
            supposés fractionnables, ce qui correspond à l&apos;option appliquée par défaut sur le mandat d&apos;achat{" "}
            {managementCompanyLabel}.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-warning-200/80 bg-warning-50/40 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-100 text-warning-700">
            <AlertTriangle size={15} />
          </div>
          <CardTitle>Limites connues de l&apos;estimation</CardTitle>
        </div>

        <ul className="flex flex-col gap-2.5 text-louve-slate text-xs leading-relaxed">
          <li>
            <strong className="text-louve-navy">1. Visibilité restreinte aux 5 meilleures limites :</strong> la page
            publique de {managementCompanyLabel} ne divulgue que les 5 prix d&apos;achat les plus hauts et les 5 prix de
            vente les plus bas. Les ordres situés au-delà du Top 5 ne peuvent pas être intégrés au cumul.
          </li>
          <li>
            <strong className="text-louve-navy">2. Photographie évolutive avant clôture :</strong> le carnet évolue
            jusqu&apos;à la date limite de réception des ordres ({scpi.orderDeadlineDate ?? "avant-veille à 16h00"}). De
            nouveaux ordres ou retraits d&apos;ici la confrontation ({scpi.nextConfrontationDate ?? "fin du mois"})
            modifieront l&apos;équilibre.
          </li>
          <li>
            <strong className="text-louve-navy">3. Délai administratif d&apos;enregistrement :</strong> seuls les
            dossiers complets, validés et couverts financièrement (fonds reçus) sont inscrits au registre. Un délai de
            traitement de quelques jours décale l&apos;apparition des derniers mandats transmis.
          </li>
          <li>
            <strong className="text-louve-navy">4. Agrégation par ligne de prix :</strong> chaque limite regroupe
            plusieurs ordres sans détailler l&apos;horodatage individuel (priorité chrono-prix sur le reliquat) ni
            d&apos;éventuelles clauses d&apos;exécution « tout ou rien ».
          </li>
        </ul>
      </div>
    </div>
  );
}
