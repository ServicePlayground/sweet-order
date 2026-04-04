import { useMutation, useQueryClient } from "@tanstack/react-query";
import { alarmApi } from "@/apps/web-user/features/alarm/apis/alarm.api";
import { alarmQueryKeys } from "@/apps/web-user/features/alarm/constants/alarmQueryKeys.constant";

export function useMarkAlarmRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => alarmApi.markRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alarmQueryKeys.list() });
      void queryClient.invalidateQueries({ queryKey: alarmQueryKeys.unread() });
    },
  });
}
