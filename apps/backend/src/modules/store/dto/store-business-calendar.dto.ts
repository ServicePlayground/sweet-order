import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { STORE_BUSINESS_TIME_HHMM_REGEX } from "@apps/backend/modules/store/constants/store-business-calendar.constants";

export class StoreBusinessDayOverrideDto {
  @ApiProperty({ description: "날짜 (YYYY-MM-DD, Asia/Seoul)", example: "2026-03-28" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiProperty({ description: "해당 일 영업 여부" })
  @IsBoolean()
  isOpen: boolean;

  @ApiPropertyOptional({ description: "영업 시 시작 (30분 단위), 휴무이면 생략", example: "10:00" })
  @ValidateIf((o: StoreBusinessDayOverrideDto) => o.isOpen)
  @Matches(STORE_BUSINESS_TIME_HHMM_REGEX)
  openTime?: string;

  @ApiPropertyOptional({ description: "영업 시 종료 (30분 단위), 휴무이면 생략", example: "20:00" })
  @ValidateIf((o: StoreBusinessDayOverrideDto) => o.isOpen)
  @Matches(STORE_BUSINESS_TIME_HHMM_REGEX)
  closeTime?: string;
}

/**
 * 스토어 영업 캘린더 (조회·수정 공통 형태)
 */
export class StoreBusinessCalendarDto {
  @ApiProperty({
    description: "정기 휴무 요일 (0=일 … 6=토)",
    type: [Number],
    example: [0, 6],
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weeklyClosedWeekdays: number[];

  @ApiProperty({
    description: "표준 영업 시작 HH:mm (30분 단위). 00:00+00:00이면 하루 전체 영업(모든 시각 허용)",
    example: "00:00",
  })
  @Matches(STORE_BUSINESS_TIME_HHMM_REGEX)
  standardOpenTime: string;

  @ApiProperty({
    description:
      "표준 영업 종료 HH:mm. 시작·종료 모두 00:00이면 전일 영업. 그 외는 픽업 [시작, 종료)",
    example: "00:00",
  })
  @Matches(STORE_BUSINESS_TIME_HHMM_REGEX)
  standardCloseTime: string;

  @ApiProperty({ type: [StoreBusinessDayOverrideDto], description: "날짜별 예외 설정" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreBusinessDayOverrideDto)
  dayOverrides: StoreBusinessDayOverrideDto[];
}

export class UpdateStoreBusinessCalendarResponseDto {
  @ApiProperty({ type: StoreBusinessCalendarDto })
  businessCalendar: StoreBusinessCalendarDto;
}
