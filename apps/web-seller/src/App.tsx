import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "@/apps/web-seller/common/styles/theme";
import { AdminLayout } from "@/apps/web-seller/common/components/layouts/AdminLayout";
import { ROUTES, ROUTE_CONFIG } from "@/apps/web-seller/common/constants/paths.constant";
import { AuthInitializerProvider } from "@/apps/web-seller/features/auth/components/providers/AuthInitializer";
import { ErrorBoundaryProvider } from "./common/components/providers/ErrorBoundaryProvider";
import { QueryProvider } from "./common/components/providers/QueryProvider";
import { LoadingFallback } from "./common/components/fallbacks/LoadingFallback";
import { Alert } from "./common/components/alerts/Alert";

const App: React.FC = () => {
  return (
    <ErrorBoundaryProvider>
      <QueryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AuthInitializerProvider>
              <Alert />
              <Suspense fallback={<LoadingFallback />}>
                <AdminLayout>
                  <Routes>
                    {ROUTE_CONFIG.map((route) => {
                      const Element = route.element;
                      return <Route key={route.path} path={route.path} element={<Element />} />;
                    })}
                    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                  </Routes>
                </AdminLayout>
              </Suspense>
            </AuthInitializerProvider>
          </Router>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundaryProvider>
  );
};

export default App;
