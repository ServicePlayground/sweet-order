import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { Message } from "@/apps/web-user/features/chat/types/chat.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

/**
 * 채팅 WebSocket 서비스
 * Socket.IO를 사용하여 실시간 채팅 기능을 제공합니다.
 *
 * web-seller와 동일한 로직이지만, 토큰 관리 방식이 다릅니다.
 */
export class ChatSocketService {
  // Socket.IO 클라이언트 인스턴스 - null일 경우 연결되지 않은 상태
  private socket: Socket | null = null;
  // 이벤트 리스너 관리 맵 - 이벤트명을 키로, 콜백 함수들의 Set을 값으로 가짐
  // 재연결 시 기존 리스너를 복원하기 위해 사용
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  // 조인한 채팅방 목록 - 재연결 시 자동 재조인을 위해 저장
  private joinedRooms: Set<string> = new Set();

  /**
   * WebSocket 연결
   *
   * 인증 토큰을 사용하여 채팅 서버에 Socket.IO 연결을 시도합니다.
   * 이미 연결된 경우 재연결하지 않습니다.
   *
   * 연결 옵션:
   * - auth: 인증 토큰을 헤더에 포함
   * - query: 인증 토큰을 쿼리 파라미터로도 전달 (서버 호환성을 위해)
   * - transports: WebSocket 우선, 실패 시 polling으로 폴백
   * - reconnection: 자동 재연결 활성화
   * - reconnectionDelay: 재연결 시도 간격 (1초)
   * - reconnectionAttempts: 최대 재연결 시도 횟수 (5회)
   *
   * 연결 후 기존에 등록된 모든 이벤트 리스너를 자동으로 재등록합니다.
   */
  connect(): void {
    // 이미 연결된 경우 중복 연결 방지
    if (this.socket?.connected) {
      return;
    }

    // 인증 스토어에서 액세스 토큰 가져오기
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.error("Access token not found. Cannot connect to chat socket.");
      useAlertStore.getState().showAlert({
        type: "error",
        title: "인증 오류",
        message: "로그인이 필요합니다. 다시 로그인해주세요.",
      });
      return;
    }

    // Socket.IO 클라이언트 인스턴스 생성 및 연결
    this.socket = io(`${API_BASE_URL}/chat`, {
      // 인증 정보를 헤더에 포함
      auth: {
        token,
      },
      // 쿼리 파라미터로도 토큰 전달 (서버 측 호환성)
      query: {
        token,
      },
      // 전송 방식: WebSocket 우선, 실패 시 HTTP polling으로 폴백
      transports: ["websocket", "polling"],
      // 자동 재연결 활성화
      reconnection: true,
      // 재연결 시도 간격 (밀리초)
      reconnectionDelay: 1000,
      // 최대 재연결 시도 횟수
      reconnectionAttempts: 5,
    });

    // 연결 성공 이벤트 핸들러
    this.socket.on("connect", () => {
      console.log("Chat socket connected:", this.socket?.id);
      // 재연결 시 이전에 조인했던 모든 채팅방 자동 재조인
      this.rejoinAllRooms();
    });

    // 연결 해제 이벤트 핸들러
    this.socket.on("disconnect", (reason) => {
      console.log("Chat socket disconnected:", reason);
      // 비정상적인 연결 끊김인 경우 사용자에게 알림
      // "io client disconnect"는 정상적인 클라이언트 종료이므로 알림 불필요
      if (reason !== "io client disconnect") {
        useAlertStore.getState().showAlert({
          type: "warning",
          title: "채팅 연결 끊김",
          message: "채팅 연결이 끊어졌습니다. 자동으로 재연결을 시도합니다.",
        });
      }
    });

    // 연결 오류 이벤트 핸들러
    this.socket.on("connect_error", (error) => {
      console.error("Chat socket connection error:", error);
      useAlertStore.getState().showAlert({
        type: "error",
        title: "채팅 연결 실패",
        message: "채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      });
    });

    // 기존 리스너 재등록
    // 재연결 시 이전에 등록된 모든 이벤트 리스너를 자동으로 복원
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
    });
  }

  /**
   * WebSocket 연결 해제
   *
   * Socket.IO 연결을 종료하고 모든 리스너를 제거합니다.
   * 컴포넌트 언마운트 시 또는 로그아웃 시 호출해야 합니다.
   */
  disconnect(): void {
    if (this.socket) {
      // Socket.IO 연결 종료
      this.socket.disconnect();
      // 소켓 인스턴스 초기화
      this.socket = null;
    }
    // 등록된 모든 이벤트 리스너 제거
    this.listeners.clear();
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
  joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 조인한 채팅방 목록에 추가
      this.joinedRooms.add(roomId);

      // 이미 연결된 경우 즉시 조인
      if (this.socket?.connected) {
        this.socket.emit("join-room", { roomId });
        resolve();
        return;
      }

      // 소켓이 없는 경우 연결 시도
      if (!this.socket) {
        this.connect();
        // connect() 호출 후 소켓이 생성되기를 잠시 기다림
        setTimeout(() => {
          if (!this.socket) {
            const error = new Error("Socket initialization failed");
            useAlertStore.getState().showAlert({
              type: "error",
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

      // 소켓이 있지만 연결되지 않은 경우
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
      useAlertStore.getState().showAlert({
        type: "error",
        title: "채팅 초기화 오류",
        message: "채팅 서비스를 초기화할 수 없습니다. 페이지를 새로고침해주세요.",
      });
      reject(error);
      return;
    }

    // 이미 연결된 경우 즉시 조인
    if (this.socket.connected) {
      this.socket.emit("join-room", { roomId });
      resolve();
      return;
    }

    // 연결 완료를 기다림
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
      useAlertStore.getState().showAlert({
        type: "error",
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
   *
   * 특정 채팅방에서 퇴장합니다. 서버에 "leave-room" 이벤트를 전송합니다.
   * 연결되지 않은 경우 조용히 무시합니다.
   *
   * @param roomId - 퇴장할 채팅방의 고유 ID
   */
  leaveRoom(roomId: string): void {
    // 조인한 채팅방 목록에서 제거
    this.joinedRooms.delete(roomId);

    // 연결 상태 확인 - 연결되지 않은 경우 조용히 무시
    if (!this.socket?.connected) {
      return;
    }

    // 서버에 채팅방 퇴장 요청 전송
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
   *
   * 서버로부터 새로운 메시지를 수신할 때 호출될 콜백 함수를 등록합니다.
   *
   * @param callback - 새 메시지를 수신했을 때 호출될 콜백 함수
   *                   매개변수로 Message 객체를 받습니다.
   *
   * @returns 리스너를 제거하는 함수를 반환합니다.
   *          컴포넌트 언마운트 시 호출하여 메모리 누수를 방지해야 합니다.
   *
   * @example
   * const removeListener = chatSocketService.onNewMessage((message) => {
   *   console.log("새 메시지:", message);
   * });
   *
   * // 컴포넌트 언마운트 시
   * removeListener();
   */
  onNewMessage(callback: (message: Message) => void): () => void {
    return this.addEventListener("new-message", callback);
  }

  /**
   * 이벤트 리스너 등록 (내부 메서드)
   *
   * Socket.IO 이벤트 리스너를 등록하고 관리합니다.
   * 리스너는 내부 맵에 저장되어 재연결 시 자동으로 복원됩니다.
   *
   * @param event - 등록할 이벤트 이름 (예: "new-message", "user-joined" 등)
   * @param callback - 이벤트 발생 시 호출될 콜백 함수
   *
   * @returns 리스너를 제거하는 함수를 반환합니다.
   *          이 함수를 호출하면 리스너가 내부 맵과 소켓에서 모두 제거됩니다.
   *
   * 동작 방식:
   * 1. 이벤트명이 맵에 없으면 새로운 Set 생성
   * 2. 콜백 함수를 Set에 추가
   * 3. 소켓이 연결되어 있으면 즉시 리스너 등록
   * 4. 리스너 제거 함수 반환 (언마운트 시 호출)
   */
  private addEventListener(event: string, callback: (data: any) => void): () => void {
    // 이벤트명이 맵에 없으면 새로운 Set 생성
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    // 콜백 함수를 Set에 추가 (중복 방지)
    this.listeners.get(event)!.add(callback);

    // 소켓이 이미 연결되어 있으면 즉시 리스너 등록
    if (this.socket) {
      this.socket.on(event, callback);
    }

    // 리스너 제거 함수 반환
    // 이 함수를 호출하면 내부 맵과 소켓에서 모두 제거됨
    return () => {
      // 내부 맵에서 콜백 제거
      this.listeners.get(event)?.delete(callback);
      // 소켓에서 이벤트 리스너 제거
      this.socket?.off(event, callback);
    };
  }

  /**
   * 연결 상태 확인
   *
   * 현재 Socket.IO 연결 상태를 확인합니다.
   *
   * @returns 연결되어 있으면 true, 그렇지 않으면 false
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

/**
 * 싱글톤 인스턴스
 *
 * 애플리케이션 전역에서 하나의 ChatSocketService 인스턴스를 공유합니다.
 * 여러 컴포넌트에서 동일한 소켓 연결을 사용할 수 있도록 합니다.
 *
 * @example
 * import { chatSocketService } from './chat-socket.service';
 *
 * // 컴포넌트에서 사용
 * chatSocketService.connect();
 * chatSocketService.onNewMessage((message) => {
 *   // 메시지 처리
 * });
 */
export const chatSocketService = new ChatSocketService();
