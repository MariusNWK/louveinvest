import {
  type ILinkProps,
  managementCompanyToLabel,
  scpiNameToSourceUrl,
  type TManagementCompany,
  type TScpiName,
} from "my-zod";
import type { ElementType } from "react";
import { BarChart2, ExternalLink, Mail, TrendingUp } from "react-feather";
import type { TCurrentComp, TMenuArray } from "./priv/interfaces";
import { SidebarButton } from "./SidebarButton";

const navigationMenu: TMenuArray[] = [
  {
    title: "Opportunités",
    href: "/",
    icon: <BarChart2 size={16} />,
  },
  {
    title: "Rendement & Confrontation",
    href: "/estimation",
    icon: <TrendingUp size={16} />,
  },
  {
    title: "Préparer un achat",
    href: "/purchase",
    icon: <Mail size={16} />,
  },
];

export interface ISidebarProps {
  link: ElementType<ILinkProps>;
  currentComp: TCurrentComp;
  isOpen: boolean;
  managementCompany?: TManagementCompany;
  scpiName?: TScpiName;
}

export function Sidebar(props: ISidebarProps) {
  const selectedManagementCompany = props.managementCompany ?? "PRAEMIA_REIM";
  const selectedScpiName = props.scpiName ?? "PRIMOPIERRE";
  const managementCompanyLabel = managementCompanyToLabel[selectedManagementCompany];
  const sourceUrl = scpiNameToSourceUrl[selectedScpiName];

  return (
    <div className="flex flex-1 flex-col justify-between px-3 py-2">
      <div className="flex flex-col gap-2">
        {props.isOpen && (
          <p className="px-3 pb-1 font-medium text-louve-slate text-[11px] uppercase tracking-wider">
            Marché secondaire
          </p>
        )}
        <ul className="flex flex-col gap-1.5">
          {navigationMenu.map((menuItem) => (
            <SidebarButton
              key={menuItem.href}
              isOpen={props.isOpen}
              currentComp={props.currentComp}
              link={props.link}
              item={menuItem}
            />
          ))}
        </ul>
      </div>

      <div className="mt-auto border-louve-border border-t pt-3">
        <ul className="flex flex-col gap-1">
          <SidebarButton
            isOpen={props.isOpen}
            currentComp={props.currentComp}
            link={props.link}
            item={{
              title: `Source ${managementCompanyLabel}`,
              href: sourceUrl,
              newTab: true,
              icon: <ExternalLink size={15} />,
            }}
          />
        </ul>
      </div>
    </div>
  );
}
