import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

export class UserNotificationListQueryDto {
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

export class UserNotificationItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ enum: ["USER_WEB"] })
  appSurface: "USER_WEB";

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

export class UserNotificationListResponseDto {
  @ApiProperty({ type: [UserNotificationItemResponseDto] })
  data: UserNotificationItemResponseDto[];

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

export class UserNotificationUnreadCountResponseDto {
  @ApiProperty()
  count: number;
}
