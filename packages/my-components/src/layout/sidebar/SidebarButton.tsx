import type { ILinkProps } from "my-zod";
import type { ElementType } from "react";
import type { TCurrentComp, TMenuArray } from "./priv/interfaces";
import { SidebarLink } from "./priv/SidebarLink";

export interface ISidebarButtonProps {
  item: TMenuArray;
  link: ElementType<ILinkProps>;
  currentComp: TCurrentComp;
  isOpen: boolean;
}

export function SidebarButton(props: ISidebarButtonProps) {
  return (
    <li>
      <SidebarLink isOpen={props.isOpen} currentComp={props.currentComp} link={props.link} item={props.item} />
    </li>
  );
}
