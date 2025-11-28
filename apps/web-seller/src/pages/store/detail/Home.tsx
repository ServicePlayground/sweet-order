import React from "react";
import { Card, CardContent } from "@/apps/web-seller/common/components/ui/card";
import { Button } from "@/apps/web-seller/common/components/ui/button";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div style={{ color }}>{icon}</div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
      </div>
      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </CardContent>
  </Card>
);

export const StoreDetailHomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        대시보드
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="총 매출"
          value="₩2,450,000"
          icon={<DollarSign className="h-5 w-5" />}
          color="hsl(var(--primary))"
        />
        <StatCard
          title="총 주문"
          value="156"
          icon={<ShoppingCart className="h-5 w-5" />}
          color="hsl(142.1 76.2% 36.3%)"
        />
        <StatCard
          title="상품 수"
          value="24"
          icon={<Package className="h-5 w-5" />}
          color="hsl(221.2 83.2% 53.3%)"
        />
        <StatCard
          title="성장률"
          value="+12.5%"
          icon={<TrendingUp className="h-5 w-5" />}
          color="hsl(24.6 95% 53.1%)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 h-[400px]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              최근 주문 현황
            </h2>
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">차트 영역 (추후 구현)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[400px]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              빠른 작업
            </h2>
            <div className="flex flex-col gap-4">
              <Button className="w-full">
                새 상품 등록
              </Button>
              <Button variant="outline" className="w-full">
                주문 확인
              </Button>
              <Button variant="outline" className="w-full">
                재고 관리
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
