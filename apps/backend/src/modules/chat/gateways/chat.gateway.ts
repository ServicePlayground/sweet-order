import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, Inject, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ChatService } from "../services/chat.service";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { MessageResponseDto } from "../dto/message-response.dto";

/**
 * WebSocket 게이트웨이
 *
 * 실시간 채팅을 위한 WebSocket 연결을 관리합니다.
 */
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  // Socket.IO 엔드포인트 경로 명시 (배포 환경에서 WebSocket 연결 문제 해결)
  path: "/socket.io/",
  // 배포 환경에서 WebSocket 연결 안정성을 위한 추가 옵션
  transports: ["websocket", "polling"], // WebSocket 우선, 실패 시 polling으로 폴백
  allowEIO3: true, // Socket.IO v3 클라이언트와의 호환성
  pingTimeout: 60000, // 연결 타임아웃 (60초)
  pingInterval: 25000, // 핑 간격 (25초)
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>

  constructor(
    @Inject(forwardRef(() => ChatService)) // forwardRef: ChatService가 ChatGateway에서 사용되므로 순환 의존성 방지
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // 서버 초기화 후 Socket.IO 서버가 준비되었는지 확인
    setTimeout(() => {
      if (this.server) {
        this.logger.log(
          `Socket.IO server initialized, CORS origins: ${process.env.CORS_ORIGIN || "not set"}`,
        );
      } else {
        this.logger.error("Socket.IO server is not initialized!");
      }
    }, 1000);
  }

  /**
   * 클라이언트 연결 시 호출
   * JWT 토큰을 검증하고 사용자 정보를 설정합니다.
   */
  async handleConnection(client: Socket) {
    const origin = client.handshake.headers.origin || "unknown";
    const userAgent = client.handshake.headers["user-agent"] || "unknown";
    this.logger.log(
      `WebSocket connection attempt from origin: ${origin}, socketId: ${client.id}, userAgent: ${userAgent}`,
    );

    try {
      // JWT 토큰 추출 및 검증
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        const errorMessage = "No token provided";
        this.logger.warn(
          `Connection rejected: ${errorMessage} (socketId: ${client.id}, origin: ${origin})`,
        );
        // 에러 메시지를 클라이언트에 전달한 후 연결 종료
        client.emit("error", { message: errorMessage, code: "NO_TOKEN" });
        client.disconnect(true);
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtVerifiedPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      const userId = payload.sub;

      // DB에서 사용자 정보 조회 (role 확인용)
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        const errorMessage = `User not found: ${userId}`;
        this.logger.warn(`${errorMessage} (socketId: ${client.id})`);
        // 에러 메시지를 클라이언트에 전달한 후 연결 종료
        client.emit("error", { message: errorMessage, code: "USER_NOT_FOUND" });
        client.disconnect(true);
        return;
      }

      const userType = user.role === "SELLER" ? "store" : "user";

      // 소켓에 사용자 정보 저장
      client.data.userId = userId;
      client.data.userType = userType;

      // 연결된 사용자 목록에 추가
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);

      this.logger.log(`User connected: ${userId} (socketId: ${client.id}, type: ${userType})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Connection error: ${errorMessage} (socketId: ${client.id})`);
      // 에러 메시지를 클라이언트에 전달한 후 연결 종료
      client.emit("error", { 
        message: errorMessage, 
        code: error instanceof Error && error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "AUTH_ERROR" 
      });
      client.disconnect(true);
    }
  }

  /**
   * 클라이언트 연결 해제 시 호출
   */
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const userSockets = this.connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(userId);
        }
      }
      this.logger.log(`User disconnected: ${userId} (socketId: ${client.id})`);
    }
  }

  /**
   * 채팅방 조인
   */
  @SubscribeMessage("join-room")
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const userId = client.data.userId;
    const { roomId } = data;

    if (!userId || !roomId) {
      return { error: "Invalid request" };
    }

    client.join(`room:${roomId}`);
    this.logger.log(`User ${userId} joined room ${roomId}`);
    return { success: true, roomId };
  }

  /**
   * 채팅방 나가기
   */
  @SubscribeMessage("leave-room")
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const userId = client.data.userId;
    const { roomId } = data;

    if (!userId || !roomId) {
      return { error: "Invalid request" };
    }

    client.leave(`room:${roomId}`);
    this.logger.log(`User ${userId} left room ${roomId}`);
    return { success: true, roomId };
  }

  /**
   * 메시지 전송
   */
  @SubscribeMessage("send-message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; text: string },
  ) {
    const userId = client.data.userId;
    const userType = client.data.userType;
    const { roomId, text } = data;

    if (!userId || !userType || !roomId || !text) {
      return { error: "Invalid request" };
    }

    try {
      // ChatService를 통해 메시지 저장 및 브로드캐스트
      const message = await this.chatService.sendMessage(roomId, text, userId, userType);
      this.logger.log(`Message sent by user ${userId} in room ${roomId}: ${message.id}`);
      return { success: true, message };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send message: ${errorMessage} (userId: ${userId}, roomId: ${roomId})`);
      return { error: errorMessage };
    }
  }

  /**
   * 채팅방에 메시지 브로드캐스트 (서버에서 클라이언트로 WebSocket으로 메시지 전송)
   */
  broadcastMessage(roomId: string, message: MessageResponseDto) {
    this.server.to(`room:${roomId}`).emit("new-message", message);
    this.logger.log(`Message broadcasted to room ${roomId}: ${message.id}`);
  }

  /**
   * Socket에서 JWT 토큰 추출
   * 
   * 우선순위:
   * 1. auth.token (Socket.IO v4 권장 방식)
   * 2. query.token (하위 호환성, 타입 안전성 처리)
   * 3. Authorization 헤더 (표준 HTTP 방식)
   */
  private extractTokenFromSocket(client: Socket): string | null {
    // 1. auth.token 우선 사용 (Socket.IO v4 권장 방식)
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === "string" && authToken.trim().length > 0) {
      return authToken;
    }

    // 2. query.token 처리 (타입 안전성 고려)
    // Socket.IO v4에서 query.token은 string | string[] | undefined 가능
    const queryToken = client.handshake.query.token;
    if (typeof queryToken === "string" && queryToken.trim().length > 0) {
      return queryToken;
    }
    // 배열인 경우 첫 번째 요소 사용 (일반적으로 발생하지 않지만 방어적 코딩)
    if (Array.isArray(queryToken) && queryToken.length > 0 && typeof queryToken[0] === "string") {
      return queryToken[0];
    }

    // 3. Authorization 헤더에서 토큰 추출 (표준 HTTP 방식)
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    return null;
  }

  /**
   * 특정 사용자에게 메시지 전송 (푸시 알림 대체용)
   */
  sendToUser(userId: string, event: string, data: any) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }
}
