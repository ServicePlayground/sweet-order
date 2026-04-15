"use client";

import Header from "@/apps/web-user/common/components/headers/Header";
import { Tabs } from "@/apps/web-user/common/components/tabs/Tabs";
import {
  UpcomingOrderList,
  useUpcomingOrderCount,
} from "@/apps/web-user/features/mypage/order/components/UpcomingOrderList";
import {
  PastOrderList,
  usePastOrderCount,
} from "@/apps/web-user/features/mypage/order/components/PastOrderList";

export default function MyOrdersPage() {
  const upcomingCount = useUpcomingOrderCount();
  const pastCount = usePastOrderCount();

  return (
    <div>
      <Header variant="back-title" title="내 예약" />
      <Tabs
        defaultTab="upcoming"
        tabs={[
          {
            id: "upcoming",
            label: `픽업 예정 ${upcomingCount}`,
            content: <UpcomingOrderList />,
          },
          {
            id: "past",
            label: `지난 예약 ${pastCount}`,
            content: <PastOrderList />,
          },
        ]}
      />
    </div>
  );
}
