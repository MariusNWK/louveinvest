"use client";

import { cn } from "cn";
import { CheckCircle, User, UserCheck } from "react-feather";
import { Button } from "ui";

export interface IAssociateStatusSelectorProps {
  isExistingAssociate: boolean;
  onToggle: (value: boolean) => void;
}

export function AssociateStatusSelector(props: IAssociateStatusSelectorProps) {
  const isExistingAssociate = props.isExistingAssociate;

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <Button
        variant="choice"
        size="none"
        isActive={!isExistingAssociate}
        onClick={() => props.onToggle(false)}
        className={cn(
          "rounded-xl px-3.5 py-2.5",
          !isExistingAssociate ? "bg-louve-blue-soft/80" : "border-louve-border-strong hover:border-louve-slate-muted",
        )}
      >
        <span className="flex items-center gap-2 font-medium text-xs">
          <User size={14} className={!isExistingAssociate ? "text-louve-blue" : "text-louve-slate"} />
          <span>Non, nouvel investisseur</span>
        </span>
        {!isExistingAssociate && <CheckCircle size={14} className="shrink-0 text-louve-blue" />}
      </Button>

      <Button
        variant="choice"
        size="none"
        isActive={isExistingAssociate}
        onClick={() => props.onToggle(true)}
        className={cn(
          "rounded-xl px-3.5 py-2.5",
          isExistingAssociate ? "bg-louve-blue-soft/80" : "border-louve-border-strong hover:border-louve-slate-muted",
        )}
      >
        <span className="flex items-center gap-2 font-medium text-xs">
          <UserCheck size={14} className={isExistingAssociate ? "text-louve-blue" : "text-louve-slate"} />
          <span>Oui, déjà associé</span>
        </span>
        {isExistingAssociate && <CheckCircle size={14} className="shrink-0 text-louve-blue" />}
      </Button>
    </div>
  );
}
