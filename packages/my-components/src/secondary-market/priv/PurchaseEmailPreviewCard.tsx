"use client";

import type { IPurchasePreparedEmail } from "my-zod";
import { CheckCircle, Copy, ExternalLink, Mail } from "react-feather";
import { Badge, Button, CardTitle } from "ui";

export interface IPurchaseEmailPreviewCardProps {
  preparedEmail: IPurchasePreparedEmail;
  onCopySubject: () => void;
  onCopyBody: () => void;
  onCopyFullEmail: () => void;
  onOpenMailClient: () => void;
}

export function PurchaseEmailPreviewCard(props: IPurchaseEmailPreviewCardProps) {
  const email = props.preparedEmail;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-louve-border bg-louve-surface p-4 shadow-2xs sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-louve-border border-b pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-louve-blue-soft font-medium text-louve-blue text-xs">
            3
          </div>
          <div>
            <CardTitle>Aperçu & récupération de l&apos;email préparé</CardTitle>
            <p className="text-louve-slate text-xs">
              Email généré automatiquement à destination de la société de gestion
            </p>
          </div>
        </div>

        {email.isComplete ? (
          <Badge variant="emerald">
            <CheckCircle size={12} />
            <span>Email complet et prêt</span>
          </Badge>
        ) : (
          <Badge variant="amber">Complétez votre identité à gauche</Badge>
        )}
      </div>

      <div className="divide-y divide-louve-border rounded-xl border border-louve-border bg-louve-bg text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-louve-slate">Destinataire :</span>
            <span className="font-medium text-louve-navy">{email.recipientName}</span>
            <span className="rounded-md bg-louve-blue-soft px-2 py-0.5 font-mono text-louve-blue text-[11px]">
              {email.recipientEmail}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5">
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            <span className="font-medium text-louve-slate">Objet :</span>
            <span className="font-medium text-louve-navy">{email.subject}</span>
          </div>
          <Button variant="outline" size="sm" onClick={props.onCopySubject} className="shrink-0 gap-1">
            <Copy size={11} />
            <span>Copier l&apos;objet</span>
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl border border-louve-border bg-louve-bg/80 p-4">
        <pre className="max-h-[380px] overflow-y-auto whitespace-pre-wrap font-sans text-louve-navy text-xs leading-relaxed">
          {email.body}
        </pre>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-louve-border-light border-t pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={props.onCopyFullEmail}>
            <Copy size={13} />
            <span>Valider &amp; copier l&apos;email complet</span>
          </Button>
          <Button variant="secondary" onClick={props.onCopyBody}>
            <Copy size={13} />
            <span>Copier le corps seul</span>
          </Button>
        </div>

        <Button variant="secondary" onClick={props.onOpenMailClient}>
          <Mail size={13} />
          <span>Ouvrir dans le client mail</span>
          <ExternalLink size={12} />
        </Button>
      </div>
    </div>
  );
}
