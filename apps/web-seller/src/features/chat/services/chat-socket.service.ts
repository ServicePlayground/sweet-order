import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/apps/web-seller/common/utils/token.util";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import { Message } from "@/apps/web-seller/features/chat/types/chat.type";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_DOMAIN;

/**
 * 채팅 WebSocket 서비스
 * Socket.IO를 사용하여 실시간 채팅 기능을 제공합니다.
 *
 * 주석은 web-user - ChatSocketService.ts 참고
 * web-user와 동일한 로직이지만, 토큰 관리 방식이 다릅니다.
 */
export class ChatSocketService {
  private socket: Socket | null = null;

  /**
   * WebSocket 연결
   *
   * 인증 토큰을 사용하여 채팅 서버에 Socket.IO 연결을 시도합니다.
   * 이미 연결된 경우 즉시 resolve됩니다.
   *
   * @returns Promise<void> - 연결이 완료되면 resolve됩니다.
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 이미 연결된 경우 즉시 resolve
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const token = getAccessToken();
      if (!token) {
        const error = new Error("Access token not found");
        console.error("Access token not found. Cannot connect to chat socket.");
        useAlertStore.getState().addAlert({
          severity: "error",
          title: "인증 오류",
          message: "로그인이 필요합니다. 다시 로그인해주세요.",
        });
        reject(error);
        return;
      }

      // 소켓이 이미 생성되어 있지만 연결되지 않은 경우
      if (this.socket && !this.socket.connected) {
        // 연결 완료를 기다림
        const onConnect = () => {
          if (this.socket) {
            this.socket.off("connect", onConnect);
            this.socket.off("connect_error", onError);
            console.log("Chat socket connected:", this.socket.id);            
            resolve();
          }
        };

        const onError = (error: Error) => {
          if (this.socket) {
            this.socket.off("connect", onConnect);
            this.socket.off("connect_error", onError);
          }
          console.error("Chat socket connection error:", error);
          useAlertStore.getState().addAlert({
            severity: "error",
            title: "채팅 연결 실패",
            message: "채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          });
          reject(error);
        };

        this.socket.once("connect", onConnect);
        this.socket.once("connect_error", onError);
        return;
      }

      this.socket = io(`${API_BASE_URL}/chat`, {
        auth: {
          token,
        },
        query: {
          token,
        },
        // Socket.IO 엔드포인트 경로 명시 (배포 환경에서 WebSocket 연결 문제 해결)
        path: "/socket.io/",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        // 배포 환경에서 연결 타임아웃 설정
        timeout: 20000,
        // WebSocket 업그레이드 시도 전 polling 연결 유지
        upgrade: true,
      });

      // 연결 성공 이벤트 핸들러
      const onConnect = () => {
        if (this.socket) {
          this.socket.off("connect", onConnect);
          this.socket.off("connect_error", onError);
          console.log("Chat socket connected:", this.socket.id);
          resolve();
        }
      };

      // 연결 오류 이벤트 핸들러
      const onError = (error: Error) => {
        if (this.socket) {
          this.socket.off("connect", onConnect);
          this.socket.off("connect_error", onError);
        }
        console.error("Chat socket connection error:", error);
        useAlertStore.getState().addAlert({
          severity: "error",
          title: "채팅 연결 실패",
          message: "채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        });
        reject(error);
      };

      this.socket.once("connect", onConnect);
      this.socket.once("connect_error", onError);

      // 연결 해제 이벤트 핸들러 (재사용을 위해 한 번만 등록)
      if (!this.socket.hasListeners("disconnect")) {
        this.socket.on("disconnect", (reason) => {
          console.log("Chat socket disconnected:", reason);
          // 비정상적인 연결 끊김인 경우 사용자에게 알림
          // "io client disconnect"는 정상적인 클라이언트 종료이므로 알림 불필요
          if (reason !== "io client disconnect") {
            useAlertStore.getState().addAlert({
              severity: "warning",
              title: "채팅 연결 끊김",
              message: "채팅 연결이 끊어졌습니다. 자동으로 재연결을 시도합니다.",
            });
          }
        });
      }
    });
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * 채팅방 조인
   *
   * 특정 채팅방에 입장합니다. 서버에 "join-room" 이벤트를 전송합니다.
   * 소켓이 연결되지 않은 경우 연결을 기다린 후 조인합니다.
   *
   * @param roomId - 입장할 채팅방의 고유 ID
   *
   * @returns Promise<void> - 연결 및 조인이 완료되면 resolve됩니다.
   */
  async joinRoom(roomId: string): Promise<void> {
    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    // 연결이 완료된 후 채팅방 조인
    if (this.socket && this.socket.connected) {
      this.socket.emit("join-room", { roomId });
    }
  }

  /**
   * 채팅방 나가기
   */
  async leaveRoom(roomId: string): Promise<void> {
    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    if (this.socket && this.socket.connected) {
      this.socket.emit("leave-room", { roomId });
    }
  }

  async onNewMessage(callback: (message: Message) => void): Promise<() => void> {
    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    // 소켓이 존재하면 연결 여부와 관계없이 리스너 등록 (재연결 시에도 자동으로 리스너가 유지됨)
    if (this.socket) {
      this.socket.on("new-message", callback);
    }
    return () => {
      if (this.socket) {
        this.socket.off("new-message", callback);
      }
    };
  }

  /**
   * 메시지 전송
   *
   * WebSocket을 통해 메시지를 전송합니다.
   *
   * @param roomId - 메시지를 전송할 채팅방 ID
   * @param text - 전송할 메시지 내용
   *
   * @returns Promise<void> - 메시지 전송이 완료되면 resolve됩니다.
   *
   * @example
   * await chatSocketService.sendMessage("room123", "안녕하세요!");
   */
  async sendMessage(roomId: string, text: string): Promise<void> {
    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    // WebSocket으로 메시지 전송
    if (this.socket && this.socket.connected) {      
      this.socket.emit("send-message", { roomId, text });
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// 싱글톤 인스턴스
export const chatSocketService = new ChatSocketService();
