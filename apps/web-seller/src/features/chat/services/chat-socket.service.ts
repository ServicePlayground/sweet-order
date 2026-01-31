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
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  // 조인한 채팅방 목록 - 재연결 시 자동 재조인을 위해 저장
  private joinedRooms: Set<string> = new Set();

  /**
   * WebSocket 연결
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      console.error("Access token not found. Cannot connect to chat socket.");
      useAlertStore.getState().addAlert({
        severity: "error",
        title: "인증 오류",
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
      });
      return;
    }

    this.socket = io(`${API_BASE_URL}/chat`, {
      auth: {
        token,
      },
      query: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Chat socket connected:", this.socket?.id);
      // 재연결 시 이전에 조인했던 모든 채팅방 자동 재조인
      this.rejoinAllRooms();
    });

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

    this.socket.on("connect_error", (error) => {
      console.error("Chat socket connection error:", error);
      useAlertStore.getState().addAlert({
        severity: "error",
        title: "채팅 연결 실패",
        message: "채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      });
    });

    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
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
    this.listeners.clear();
  }

  /**
   * 채팅방 조인
   */
  joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 조인한 채팅방 목록에 추가
      this.joinedRooms.add(roomId);

      if (this.socket?.connected) {
        this.socket.emit("join-room", { roomId });
        resolve();
        return;
      }

      if (!this.socket) {
        this.connect();
        setTimeout(() => {
          if (!this.socket) {
            const error = new Error("Socket initialization failed");
            useAlertStore.getState().addAlert({
              severity: "error",
              title: "채팅 초기화 실패",
              message: "채팅 서비스를 초기화할 수 없습니다. 페이지를 새로고침해주세요.",
            });
            reject(error);
            return;
          }
          this.setupJoinRoomListeners(roomId, resolve, reject);
        }, 100);
        return;
      }

      this.setupJoinRoomListeners(roomId, resolve, reject);
    });
  }

  /**
   * joinRoom을 위한 이벤트 리스너 설정 (내부 헬퍼 메서드)
   */
  private setupJoinRoomListeners(
    roomId: string,
    resolve: () => void,
    reject: (error: Error) => void,
  ): void {
    if (!this.socket) {
      const error = new Error("Socket is not initialized");
      useAlertStore.getState().addAlert({
        severity: "error",
        title: "채팅 초기화 오류",
        message: "채팅 서비스를 초기화할 수 없습니다. 페이지를 새로고침해주세요.",
      });
      reject(error);
      return;
    }

    if (this.socket.connected) {
      this.socket.emit("join-room", { roomId });
      resolve();
      return;
    }

    const onConnect = () => {
      if (this.socket) {
        this.socket.emit("join-room", { roomId });
        this.socket.off("connect", onConnect);
        this.socket.off("connect_error", onError);
        resolve();
      }
    };

    const onError = (error: Error) => {
      if (this.socket) {
        this.socket.off("connect", onConnect);
        this.socket.off("connect_error", onError);
      }
      console.error("Failed to connect socket for joining room:", error);
      useAlertStore.getState().addAlert({
        severity: "error",
        title: "채팅방 입장 실패",
        message: "채팅방에 입장할 수 없습니다. 잠시 후 다시 시도해주세요.",
      });
      reject(error);
    };

    this.socket.once("connect", onConnect);
    this.socket.once("connect_error", onError);
  }

  /**
   * 채팅방 나가기
   */
  leaveRoom(roomId: string): void {
    // 조인한 채팅방 목록에서 제거
    this.joinedRooms.delete(roomId);

    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit("leave-room", { roomId });
  }

  /**
   * 재연결 시 이전에 조인했던 모든 채팅방 자동 재조인
   */
  private rejoinAllRooms(): void {
    if (!this.socket?.connected) {
      return;
    }

    this.joinedRooms.forEach((roomId) => {
      this.socket?.emit("join-room", { roomId });
    });
  }

  /**
   * 새 메시지 수신 리스너 등록
   */
  onNewMessage(callback: (message: Message) => void): () => void {
    return this.addEventListener("new-message", callback);
  }

  /**
   * 이벤트 리스너 등록
   */
  private addEventListener(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    return () => {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    };
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
