import { ReactNode } from "react";
import Header from "@/apps/web-user/common/components/headers/Header";
import { AuthInitializerProvider } from "@/apps/web-user/features/auth/components/providers/AuthInitializer";
import { Alert } from "@/apps/web-user/common/components/alerts/Alert";
import { ConfirmAlert } from "@/apps/web-user/common/components/alerts/ConfirmAlert";

interface RootWrapperLayoutProps {
  children: ReactNode;
}

export default function RootWrapperLayout({ children }: RootWrapperLayoutProps) {
  return (
    <>
      <Header />
      <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto" }}>{children}</div>
      <AuthInitializerProvider />
      <Alert />
      <ConfirmAlert />
    </>
  );
}
