"use client";

import { AlertTriangle, RefreshCw } from "react-feather";
import { Button, SurfaceCard } from "ui";

export interface IDashboardErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorPage(props: IDashboardErrorPageProps) {
  return (
    <SurfaceCard
      title="Indisponibilité temporaire des données de marché"
      subtitle="Impossible de récupérer ou synchroniser les données de la SCPI pour le moment."
    >
      <div className="flex flex-col items-start gap-4 rounded-xl border border-warning-200 bg-warning-50/60 p-4 text-xs text-louve-navy">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning-600" />
          <p className="leading-relaxed">
            {props.error.message ||
              "La page source de la société de gestion ou la base de données est momentanément indisponible."}
          </p>
        </div>

        <Button variant="primary" onClick={() => props.reset()}>
          <RefreshCw size={13} />
          <span>Réessayer la synchronisation</span>
        </Button>
      </div>
    </SurfaceCard>
  );
}
