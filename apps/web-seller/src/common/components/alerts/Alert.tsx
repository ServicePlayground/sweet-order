"use client";

import { Alert as MuiAlert, Snackbar, AlertTitle, Slide, SlideProps } from "@mui/material";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function Alert() {
  const { alerts, removeAlert } = useAlertStore();

  const handleClose = (id: string) => {
    removeAlert(id);
  };

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.autoHideDuration}
          onClose={() => handleClose(alert.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiSnackbar-root": {
              top: 24 + alerts.indexOf(alert) * 80, // 여러 알림이 겹치지 않도록
            },
          }}
        >
          <MuiAlert
            onClose={() => handleClose(alert.id)}
            severity={alert.severity}
            variant={alert.variant}
            sx={{
              minWidth: 300,
              maxWidth: 400,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
}
