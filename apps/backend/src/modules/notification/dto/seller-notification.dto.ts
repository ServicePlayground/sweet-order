import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class SellerNotificationListQueryDto {
  @ApiProperty({ description: "스토어 ID (cuid)" })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiPropertyOptional({ description: "안 읽음만" })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  unreadOnly?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 20;
}

export class SellerNotificationMarkAllReadBodyDto {
  @ApiProperty({ description: "스토어 ID (cuid)" })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class SellerNotificationPreferenceQueryDto {
  @ApiProperty({ description: "스토어 ID (cuid)" })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class SellerNotificationPreferenceUpdateDto {
  @ApiProperty({ description: "스토어 ID (cuid)" })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  orderNotificationsEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  orderNotificationSoundEnabled?: boolean;
}

export class SellerNotificationItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ enum: ["SELLER_WEB"] })
  appSurface: "SELLER_WEB";

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  storeId: string;

  @ApiProperty()
  orderId: string;
}

export class SellerNotificationListResponseDto {
  @ApiProperty({ type: [SellerNotificationItemResponseDto] })
  data: SellerNotificationItemResponseDto[];

  @ApiProperty()
  meta: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class SellerNotificationPreferenceResponseDto {
  @ApiProperty({ enum: ["SELLER_WEB"] })
  appSurface: "SELLER_WEB";

  @ApiProperty()
  orderNotificationsEnabled: boolean;

  @ApiProperty()
  orderNotificationSoundEnabled: boolean;
}

export class SellerNotificationUnreadCountQueryDto {
  @ApiProperty({ description: "스토어 ID (cuid)" })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class SellerNotificationUnreadCountResponseDto {
  @ApiProperty()
  count: number;
}
