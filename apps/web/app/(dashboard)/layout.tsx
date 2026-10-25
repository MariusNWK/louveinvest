import { Container, Header, Sidebar } from "my-components";
import type { ReactNode } from "react";
import { DashboardWrapper } from "../../wrappers/DashboardWrapper";
import { Link } from "../../wrappers/Link";
import { SidebarCurrentWrapper } from "../../wrappers/SidebarCurrentWrapper";

export interface IDashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout(props: IDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-louve-bg">
      <DashboardWrapper
        openedSidebar={
          <Sidebar
            isOpen
            currentComp={SidebarCurrentWrapper}
            link={Link}
            managementCompany="PRAEMIA_REIM"
            scpiName="PRIMOPIERRE"
          />
        }
        closedSidebar={
          <Sidebar
            isOpen={false}
            currentComp={SidebarCurrentWrapper}
            link={Link}
            managementCompany="PRAEMIA_REIM"
            scpiName="PRIMOPIERRE"
          />
        }
      >
        <Header scpiName="PRIMOPIERRE" managementCompany="PRAEMIA_REIM" />
        <Container>{props.children}</Container>
      </DashboardWrapper>
    </div>
  );
}
