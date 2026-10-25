import type { ILinkProps } from "my-zod";
import type { ElementType } from "react";
import type { IMenuItem, TCurrentComp } from "./interfaces";

export interface ISidebarLinkProps {
  link: ElementType<ILinkProps>;
  currentComp: TCurrentComp;
  item: IMenuItem;
  isOpen: boolean;
}

export function SidebarLink(props: ISidebarLinkProps) {
  const LinkComponent = props.link;
  const CurrentComponent = props.currentComp;
  const item = props.item;

  return (
    <LinkComponent
      href={item.href}
      target={item.newTab ? "_blank" : undefined}
      id={item.href === "/" ? "opportunites" : item.href.replace("/", "")}
    >
      <CurrentComponent href={item.href} label={item.title} isOpen={props.isOpen}>
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">{item.icon}</div>
        {props.isOpen && (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span className="truncate font-medium text-sm">{item.title}</span>
          </div>
        )}
      </CurrentComponent>
    </LinkComponent>
  );
}
