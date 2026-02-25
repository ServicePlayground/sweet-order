import { useQuery } from "@tanstack/react-query";
import { Alarm } from "@/apps/web-user/features/alarm/types/alarm.type";

// TODO: 실제 API 연결 시 교체
const DUMMY_ALARMS: Alarm[] = [
  {
    id: "1",
    imageUrl: undefined,
    title: "알림 제목",
    content: "알림 내용 알림내용",
    date: "오늘",
    time: "12:00",
  },
  {
    id: "2",
    imageUrl: undefined,
    title: "알림 제목",
    content: "알림 내용 알림내용",
    date: "오늘",
    time: "12:00",
  },
  {
    id: "3",
    imageUrl: undefined,
    title: "알림 제목",
    content: "알림 내용 알림내용",
    date: "어제",
    time: "09:30",
  },
];

async function fetchAlarmList(): Promise<Alarm[]> {
  // TODO: 실제 API 호출로 교체
  // return api.get("/alarms");
  return DUMMY_ALARMS;
}

export function useAlarmList() {
  return useQuery({
    queryKey: ["alarm", "list"],
    queryFn: fetchAlarmList,
  });
}
