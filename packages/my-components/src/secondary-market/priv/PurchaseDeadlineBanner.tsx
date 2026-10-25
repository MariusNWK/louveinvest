import { Calendar, Clock } from "react-feather";

export interface IPurchaseDeadlineBannerProps {
  orderDeadlineDate: string | null;
  nextConfrontationDate: string | null;
}

export function PurchaseDeadlineBanner(props: IPurchaseDeadlineBannerProps) {
  if (!props.orderDeadlineDate && !props.nextConfrontationDate) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-louve-blue-border bg-louve-blue-soft/70 px-3.5 py-2.5 text-xs">
      {props.orderDeadlineDate && (
        <span className="flex items-center gap-1.5 text-louve-navy">
          <Clock size={14} className="shrink-0 text-louve-blue" />
          <span>
            Date limite de réception des ordres : <strong>{props.orderDeadlineDate}</strong>
          </span>
        </span>
      )}
      {props.nextConfrontationDate && (
        <span className="flex items-center gap-1.5 text-louve-slate">
          <Calendar size={14} className="shrink-0 text-louve-blue" />
          <span>Prochaine confrontation : {props.nextConfrontationDate}</span>
        </span>
      )}
    </div>
  );
}
