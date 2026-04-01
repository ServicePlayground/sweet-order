import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  NotificationAppSurface,
  NotificationCategory,
  Prisma,
} from "@apps/backend/infra/database/prisma/generated/client";
export interface SellerNotificationItemDto {
  id: string;
  createdAt: string;
  appSurface: "SELLER_WEB";
  title: string;
  body: string;
  read: boolean;
  storeId: string;
  orderId: string;
}

export interface NotificationPreferenceDto {
  appSurface: "SELLER_WEB";
  orderNotificationsEnabled: boolean;
  orderNotificationSoundEnabled: boolean;
}

/**
 * 판매자 웹 알림 API의 영속성 계층.
 * - 목록·읽음·안 읽음 개수·설정(스토어별)·주문 알림 저장
 */
@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * DB 행을 판매자 알림 응답 DTO로 변환합니다.
   * 현재 SELLER_WEB 주문 알림만 다루므로 storeId/orderId는 필수로 간주합니다.
   */
  private toItemDto(row: {
    id: string;
    createdAt: Date;
    title: string;
    body: string;
    readAt: Date | null;
    storeId: string | null;
    orderId: string | null;
  }): SellerNotificationItemDto {
    if (!row.storeId || !row.orderId) {
      throw new Error("ORDER 알림에는 storeId·orderId가 필요합니다.");
    }
    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      appSurface: "SELLER_WEB",
      title: row.title,
      body: row.body,
      read: row.readAt != null,
      storeId: row.storeId,
      orderId: row.orderId,
    };
  }

  /**
   * 스토어 소유자 검증. 소유자가 아니면 403을 반환합니다.
   */
  private async assertStoreOwnedByUser(storeId: string, userId: string): Promise<void> {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, userId },
      select: { id: true },
    });
    if (!store) {
      throw new ForbiddenException("해당 스토어에 대한 권한이 없습니다.");
    }
  }

  /**
   * 특정 스토어의 SELLER_WEB 알림 목록을 페이지네이션으로 조회합니다.
   * 현재는 ORDER 카테고리만 반환하며, `unreadOnly`가 true이면 미읽음만 필터링합니다.
   */
  async listSellerWebForStore(params: {
    userId: string;
    storeId: string;
    unreadOnly: boolean;
    page: number;
    limit: number;
  }): Promise<{ items: SellerNotificationItemDto[]; meta: PrismaPaginationMeta }> {
    await this.assertStoreOwnedByUser(params.storeId, params.userId);
    const skip = (params.page - 1) * params.limit;
    const where: Prisma.UserNotificationWhereInput = {
      userId: params.userId,
      appSurface: NotificationAppSurface.SELLER_WEB,
      category: NotificationCategory.ORDER,
      storeId: params.storeId,
      orderId: { not: null },
      ...(params.unreadOnly ? { readAt: null } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.userNotification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: params.limit,
      }),
      this.prisma.userNotification.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / params.limit));
    return {
      items: rows.map((r) => this.toItemDto(r)),
      meta: {
        currentPage: params.page,
        limit: params.limit,
        totalItems: total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1,
      },
    };
  }

  /**
   * 단일 알림을 읽음 처리합니다. 해당 알림이 요청한 사용자 소유인지 확인합니다.
   */
  async markReadSellerWeb(params: { userId: string; notificationId: string }): Promise<void> {
    const row = await this.prisma.userNotification.findFirst({
      where: {
        id: params.notificationId,
        userId: params.userId,
        appSurface: NotificationAppSurface.SELLER_WEB,
        category: NotificationCategory.ORDER,
        orderId: { not: null },
      },
    });
    if (!row) {
      throw new NotFoundException("알림을 찾을 수 없습니다.");
    }
    await this.prisma.userNotification.update({
      where: { id: row.id },
      data: { readAt: new Date() },
    });
  }

  /**
   * 해당 스토어의 SELLER_WEB ORDER 알림 중 미읽음을 모두 읽음 처리합니다.
   */
  async markAllReadSellerWebForStore(params: { userId: string; storeId: string }): Promise<void> {
    await this.assertStoreOwnedByUser(params.storeId, params.userId);
    await this.prisma.userNotification.updateMany({
      where: {
        userId: params.userId,
        appSurface: NotificationAppSurface.SELLER_WEB,
        category: NotificationCategory.ORDER,
        storeId: params.storeId,
        orderId: { not: null },
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  /**
   * 스토어 단위 판매자 알림 설정을 조회합니다. 없으면 기본값으로 생성(upsert)합니다.
   */
  async getOrCreatePreferenceSellerWeb(
    userId: string,
    storeId: string,
  ): Promise<NotificationPreferenceDto> {
    await this.assertStoreOwnedByUser(storeId, userId);
    const row = await this.prisma.userNotificationPreference.upsert({
      where: {
        userId_appSurface_storeId: {
          userId,
          appSurface: NotificationAppSurface.SELLER_WEB,
          storeId,
        },
      },
      create: {
        userId,
        storeId,
        appSurface: NotificationAppSurface.SELLER_WEB,
        orderNotificationsEnabled: true,
        orderNotificationSoundEnabled: true,
      },
      update: {},
    });
    return this.toPreferenceDto(row);
  }

  /**
   * 스토어 단위 알림 설정을 갱신합니다. 먼저 `getOrCreate`로 행을 보장한 뒤, 전달된 필드만 병합합니다.
   */
  async updatePreferenceSellerWeb(
    userId: string,
    storeId: string,
    patch: {
      orderNotificationsEnabled?: boolean;
      orderNotificationSoundEnabled?: boolean;
    },
  ): Promise<NotificationPreferenceDto> {
    const existing = await this.getOrCreatePreferenceSellerWeb(userId, storeId);
    const next = {
      orderNotificationsEnabled:
        patch.orderNotificationsEnabled ?? existing.orderNotificationsEnabled,
      orderNotificationSoundEnabled:
        patch.orderNotificationSoundEnabled ?? existing.orderNotificationSoundEnabled,
    };
    const row = await this.prisma.userNotificationPreference.update({
      where: {
        userId_appSurface_storeId: {
          userId,
          appSurface: NotificationAppSurface.SELLER_WEB,
          storeId,
        },
      },
      data: {
        orderNotificationsEnabled: next.orderNotificationsEnabled,
        orderNotificationSoundEnabled: next.orderNotificationSoundEnabled,
      },
    });
    return this.toPreferenceDto(row);
  }

  /**
   * 주문 이벤트 알림을 저장합니다.
   * (문구 결정은 dispatch/copy util에서 끝내고 여기서는 저장만 담당)
   */
  async createSellerWebOrderNotification(params: {
    recipientUserId: string;
    title: string;
    body: string;
    storeId: string;
    orderId: string;
  }): Promise<SellerNotificationItemDto> {
    const row = await this.prisma.userNotification.create({
      data: {
        userId: params.recipientUserId,
        appSurface: NotificationAppSurface.SELLER_WEB,
        category: NotificationCategory.ORDER,
        title: params.title,
        body: params.body,
        storeId: params.storeId,
        orderId: params.orderId,
      },
    });
    return this.toItemDto(row);
  }

  /**
   * 해당 스토어의 미읽음 SELLER_WEB ORDER 알림 개수를 반환합니다.
   */
  async countUnreadSellerWebForStore(userId: string, storeId: string): Promise<number> {
    await this.assertStoreOwnedByUser(storeId, userId);
    return this.prisma.userNotification.count({
      where: {
        userId,
        appSurface: NotificationAppSurface.SELLER_WEB,
        category: NotificationCategory.ORDER,
        storeId,
        orderId: { not: null },
        readAt: null,
      },
    });
  }

  /**
   * Prisma 설정 행을 API 응답 DTO 형태로 맞춥니다.
   */
  private toPreferenceDto(row: {
    orderNotificationsEnabled: boolean;
    orderNotificationSoundEnabled: boolean;
  }): NotificationPreferenceDto {
    return {
      appSurface: "SELLER_WEB",
      orderNotificationsEnabled: row.orderNotificationsEnabled,
      orderNotificationSoundEnabled: row.orderNotificationSoundEnabled,
    };
  }
}

export interface PrismaPaginationMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
