"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import { Alert as AlertComponent, AlertTitle, AlertDescription } from "@/apps/web-seller/common/components/ui/alert";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/apps/web-seller/lib/utils";

export function Alert() {
  const { alerts, removeAlert } = useAlertStore();

  useEffect(() => {
    alerts.forEach((alert) => {
      if (alert.autoHideDuration) {
        const timer = setTimeout(() => {
          removeAlert(alert.id);
        }, alert.autoHideDuration);

        return () => clearTimeout(timer);
      }
    });
  }, [alerts, removeAlert]);

  const handleClose = (id: string) => {
    removeAlert(id);
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case "success":
        return "border-green-500 text-green-900 bg-green-50 dark:bg-green-950 dark:text-green-100";
      case "error":
        return "border-destructive text-destructive-foreground bg-destructive/10";
      case "warning":
        return "border-orange-500 text-orange-900 bg-orange-50 dark:bg-orange-950 dark:text-orange-100";
      case "info":
        return "border-blue-500 text-blue-900 bg-blue-50 dark:bg-blue-950 dark:text-blue-100";
      default:
        return "";
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          className={cn(
            "pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300",
            "min-w-[300px] max-w-[400px]"
          )}
          style={{
            marginBottom: index * 8,
          }}
        >
          <AlertComponent
            className={cn(
              "relative shadow-lg border-2",
              getSeverityClasses(alert.severity)
            )}
          >
            <div className="flex items-start gap-3">
              {getIcon(alert.severity)}
              <div className="flex-1">
                {alert.title && (
                  <AlertTitle className="mb-1">{alert.title}</AlertTitle>
                )}
                <AlertDescription>{alert.message}</AlertDescription>
              </div>
              <button
                onClick={() => handleClose(alert.id)}
                className="flex-shrink-0 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </AlertComponent>
        </div>
      ))}
    </div>
  );
}
