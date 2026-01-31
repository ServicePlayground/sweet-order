import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { ChatService } from "@apps/backend/modules/chat/services/chat.service";
import { ChatRoomService } from "@apps/backend/modules/chat/services/chat-room.service";
import { ChatMessageService } from "@apps/backend/modules/chat/services/chat-message.service";
import { ChatGateway } from "@apps/backend/modules/chat/gateways/chat.gateway";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";

/**
 * 채팅 관련 모듈
 *
 * 채팅방과 메시지 관리를 통합적으로 처리합니다.
 * - ChatService: Facade 패턴으로 통합 인터페이스 제공
 * - ChatRoomService: 채팅방 관련 비즈니스 로직
 * - ChatMessageService: 메시지 관련 비즈니스 로직
 * - ChatGateway: WebSocket 실시간 통신
 */
@Module({
  imports: [DatabaseModule, JwtModule, ConfigModule],
  providers: [ChatService, ChatRoomService, ChatMessageService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
