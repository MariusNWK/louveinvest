"use client";

import { ContainerWrapper, LouveLogo, SidebarWrapper } from "my-components";
import { createContext, type ReactNode, useContext, useState } from "react";

export interface IDashboardWrapperProps {
  closedSidebar: ReactNode;
  openedSidebar: ReactNode;
  children: ReactNode;
}

export const SidebarOpenContext = createContext<boolean>(true);

export function useSidebarOpen(): boolean {
  return useContext(SidebarOpenContext);
}

export function DashboardWrapper(props: IDashboardWrapperProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <SidebarOpenContext.Provider value={isOpen}>
      <SidebarWrapper
        isOpen={isOpen}
        toggleOpen={() => setIsOpen((previousState) => !previousState)}
        logo={<LouveLogo collapsed={!isOpen} />}
      >
        {isOpen ? props.openedSidebar : props.closedSidebar}
      </SidebarWrapper>
      <ContainerWrapper isOpen={isOpen}>{props.children}</ContainerWrapper>
    </SidebarOpenContext.Provider>
  );
}
