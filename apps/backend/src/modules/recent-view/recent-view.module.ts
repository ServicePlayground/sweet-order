import { Module } from "@nestjs/common";
import { RecentViewService } from "@apps/backend/modules/recent-view/recent-view.service";

/**
 * 최근 본 상품/스토어 모듈
 * 마이페이지 최근 본 목록 조회 및 조회 이력 저장을 제공합니다.
 */
@Module({
  providers: [RecentViewService],
  exports: [RecentViewService],
})
export class RecentViewModule {}
