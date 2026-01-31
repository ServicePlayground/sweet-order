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
    origin: (origin, callback) => {
      // CORS_ORIGIN 환경변수에서 허용된 origin 목록 가져오기
      const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
      // origin이 없거나 허용된 목록에 있으면 허용
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
  namespace: "/chat",
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
  ) {}

  /**
   * 클라이언트 연결 시 호출
   * JWT 토큰을 검증하고 사용자 정보를 설정합니다.
   */
  async handleConnection(client: Socket) {
    try {
      // JWT 토큰 추출 및 검증
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        this.logger.warn(`Connection rejected: No token provided (socketId: ${client.id})`);
        client.disconnect();
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
        this.logger.warn(`User not found: ${userId} (socketId: ${client.id})`);
        client.disconnect();
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
      client.disconnect();
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
   * 채팅방에 메시지 브로드캐스트 (서버에서 클라이언트로 WebSocket으로 메시지 전송)
   */
  broadcastMessage(roomId: string, message: MessageResponseDto) {
    this.server.to(`room:${roomId}`).emit("new-message", message);
    this.logger.log(`Message broadcasted to room ${roomId}: ${message.id}`);
  }

  /**
   * Socket에서 JWT 토큰 추출
   */
  private extractTokenFromSocket(client: Socket): string | null {
    // 쿼리 파라미터에서 토큰 추출
    const token = client.handshake.query.token as string;
    if (token) {
      return token;
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
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
