import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SyncConsumerFcmTokenBodyDto {
  @ApiProperty({
    description: "현재 디바이스에서 발급된 Firebase FCM 앱 푸시 토큰",
    example: "fXhN3y...:APA91bGvExampleTokenStringForAppPushNotification",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(4096)
  token: string;

  @ApiProperty({
    description: "디바이스(설치 단위) 식별자. 동일 디바이스 토큰 교체를 구분하기 위해 사용",
    example: "ios:3f2a55f6-8881-4d04-a5e2-8f63f8a7e2f0",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  deviceId: string;
}
