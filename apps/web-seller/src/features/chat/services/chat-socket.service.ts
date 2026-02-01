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
  // 현재 조인된 채팅방 목록 (재연결 시 자동으로 다시 조인하기 위해 추적)
  private joinedRooms: Set<string> = new Set();
  // 메시지 리스너 관리 (재연결 시 자동으로 재바인딩하기 위해 추적)
  private messageListeners = new Set<(msg: Message) => void>();
  // 초기 연결 여부 추적 (재연결인지 구분하기 위해)
  private isInitialConnection = true;
  // 상태 복원용 connect 핸들러 등록 여부 추적 (hasListeners 대신 사용)
  private isConnectHandlerBound = false;

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
        // 🔥 상태 복원용 connect 핸들러는 한 번만 등록
        this.setupConnectHandler();

        // Promise resolve용 핸들러 (이번 connect() 호출에만 사용)
        const onConnectOnce = () => {
          if (this.socket) {
            this.socket.off("connect", onConnectOnce);
            this.socket.off("connect_error", onError);
            resolve();
          }
        };

        const onError = (error: Error) => {
          if (this.socket) {
            this.socket.off("connect", onConnectOnce);
            this.socket.off("connect_error", onError);
          }
          console.error("Chat socket connection error:", error);
          useAlertStore.getState().addAlert({
            severity: "error",
            title: "채팅 연결 실패",
            message: "[100] 채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          });
          reject(error);
        };

        this.socket.once("connect", onConnectOnce);
        this.socket.once("connect_error", onError);
        return;
      }

      // Socket.IO 클라이언트 인스턴스 생성 및 연결
      // Socket.IO v4에서는 path 옵션을 명시적으로 설정해야 배포 환경에서 정상 작동합니다
      this.socket = io(API_BASE_URL, {
        // 인증 정보를 헤더에 포함
        auth: {
          token,
        },
        // 쿼리 파라미터로도 토큰 전달 (서버 측 호환성)
        query: {
          token,
        },
        // Socket.IO 엔드포인트 경로 명시 (배포 환경에서 WebSocket 연결 문제 해결)
        path: "/socket.io/",
        // 전송 방식: HTTP polling만 사용
        transports: ["polling"],
        // 자동 재연결 활성화
        reconnection: true,
        // 재연결 시도 간격 (밀리초)
        reconnectionDelay: 1000,
        // 최대 재연결 시도 횟수
        reconnectionAttempts: 5,
        // 배포 환경에서 연결 타임아웃 설정
        timeout: 30000,
        // 기존 연결 재사용
        forceNew: false,
        // 자동 연결 활성화
        autoConnect: true,
      });

      // 🔥 상태 복원용 connect 핸들러는 한 번만 등록
      this.setupConnectHandler();

      // Promise resolve용 핸들러 (이번 connect() 호출에만 사용)
      const onConnectOnce = () => {
        if (this.socket) {
          this.socket.off("connect", onConnectOnce);
          this.socket.off("connect_error", onError);
          resolve();
        }
      };

      // 연결 오류 이벤트 핸들러 (첫 연결 시에만 사용)
      const onError = (error: Error) => {
        if (this.socket) {
          this.socket.off("connect", onConnectOnce);
          this.socket.off("connect_error", onError);
        }
        console.error("Chat socket connection error:", error);
        useAlertStore.getState().addAlert({
          severity: "error",
          title: "채팅 연결 실패",
          message: "[101] 채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        });
        reject(error);
      };

      this.socket.once("connect", onConnectOnce);
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

      // 재연결 시도 중 이벤트 핸들러
      if (!this.socket.hasListeners("reconnect_attempt")) {
        this.socket.on("reconnect_attempt", (attemptNumber) => {
          console.log(`Chat socket reconnection attempt ${attemptNumber}`);
        });
      }

      // 재연결 시도 중 이벤트 핸들러 (보조용, connect 이벤트에서 주로 처리)
      if (!this.socket.hasListeners("reconnect")) {
        this.socket.on("reconnect", (attemptNumber) => {
          console.log(`Chat socket reconnected after ${attemptNumber} attempts:`, this.socket?.id);
        });
      }

      // 재연결 실패 시 이벤트 핸들러
      if (!this.socket.hasListeners("reconnect_error")) {
        this.socket.on("reconnect_error", (error) => {
          console.error("Chat socket reconnection error:", error);
        });
      }

      // 재연결 시도 횟수 초과 시 이벤트 핸들러
      if (!this.socket.hasListeners("reconnect_failed")) {
        this.socket.on("reconnect_failed", () => {
          console.error("Chat socket reconnection failed after all attempts");
          useAlertStore.getState().addAlert({
            severity: "error",
            title: "채팅 연결 실패",
            message: "[102] 채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          });
        });
      }
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
    }

    // 🔥 모든 상태 초기화
    this.socket = null;
    this.joinedRooms.clear();
    this.messageListeners.clear();
    this.isInitialConnection = true;
    this.isConnectHandlerBound = false;
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

    // 연결 상태 확인
    if (!this.socket || !this.socket.connected) {
      return;
    }

    // 🔥 이미 조인된 방인 경우 중복 emit 방지
    if (this.joinedRooms.has(roomId)) {
      return;
    }

    // 연결이 완료된 후 채팅방 조인
    this.socket.emit("join-room", { roomId });
    // 조인한 채팅방을 목록에 추가 (재연결 시 자동으로 다시 조인하기 위해)
    this.joinedRooms.add(roomId);
  }

  /**
   * 채팅방 나가기
   *
   * 조인한 채팅방이 하나도 없으면 연결을 끊어 불필요한 polling 요청을 방지합니다.
   */
  async leaveRoom(roomId: string): Promise<void> {
    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    // 연결 상태 확인
    if (!this.socket || !this.socket.connected) {
      return;
    }

    this.socket.emit("leave-room", { roomId });

    // 조인 목록에서 제거 (재연결 시 다시 조인하지 않도록)
    this.joinedRooms.delete(roomId);

    // 조인한 채팅방이 하나도 없으면 연결을 끊어 불필요한 polling 요청 방지
    if (this.joinedRooms.size === 0) {
      this.disconnect();
    }
  }

  /**
   * 새 메시지 수신 리스너 등록
   *
   * 서버로부터 새로운 메시지를 수신할 때 호출될 콜백 함수를 등록합니다.
   * 리스너는 Set으로 관리되어 재연결 시 자동으로 재바인딩됩니다.
   *
   * @param callback - 새 메시지를 수신했을 때 호출될 콜백 함수
   *                   매개변수로 Message 객체를 받습니다.
   *
   * @returns 리스너를 제거하는 함수를 반환합니다.
   *          컴포넌트 언마운트 시 호출하여 메모리 누수를 방지해야 합니다.
   *
   * @example
   * const removeListener = await chatSocketService.onNewMessage((message) => {
   *   console.log("새 메시지:", message);
   * });
   *
   * // 컴포넌트 언마운트 시
   * removeListener();
   */
  async onNewMessage(callback: (message: Message) => void): Promise<() => void> {
    // 🔥 리스너를 Set에 추가
    this.messageListeners.add(callback);

    // 먼저 연결이 완료될 때까지 대기
    await this.connect();

    // 소켓이 존재하면 리스너 등록
    if (this.socket) {
      this.socket.on("new-message", callback);
    }

    // 리스너 제거 함수 반환
    return () => {
      // 🔥 Set에서 제거
      this.messageListeners.delete(callback);
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

    // 연결 상태 확인
    if (!this.socket || !this.socket.connected) {
      return;
    }

    // 채팅방에 조인되어 있는지 확인
    if (!this.joinedRooms.has(roomId)) {
      // 조인되어 있지 않으면 다시 조인 시도
      await this.joinRoom(roomId);
    }

    // WebSocket으로 메시지 전송
    this.socket.emit("send-message", { roomId, text });
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * 재연결 시 이전에 조인했던 채팅방들을 자동으로 다시 조인
   *
   * Socket.IO가 자동으로 재연결되면, 이전에 조인했던 채팅방들을
   * 자동으로 다시 조인하여 채팅 기능이 정상적으로 동작하도록 합니다.
   */
  private rejoinRooms(): void {
    if (!this.socket || !this.socket.connected) {
      return;
    }

    // 조인했던 모든 채팅방을 다시 조인
    const roomIds = Array.from(this.joinedRooms);
    if (roomIds.length === 0) {
      console.log("No rooms to rejoin");
      return;
    }

    console.log(`Rejoining ${roomIds.length} room(s):`, roomIds);
    roomIds.forEach((roomId) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit("join-room", { roomId });
        console.log(`Rejoined room: ${roomId}`);
      }
    });
  }

  /**
   * 재연결 시 메시지 리스너를 재바인딩
   *
   * Socket.IO가 재연결되면, 이전에 등록했던 모든 메시지 리스너를
   * 자동으로 재바인딩하여 메시지 수신이 정상적으로 동작하도록 합니다.
   */
  private rebindMessageListeners(): void {
    if (!this.socket) return;

    this.messageListeners.forEach((callback) => {
      // 기존 리스너 제거 (중복 방지)
      this.socket!.off("new-message", callback);
      // 리스너 재등록
      this.socket!.on("new-message", callback);
    });

    console.log(`Rebound ${this.messageListeners.size} message listener(s)`);
  }

  /**
   * connect 이벤트 핸들러 설정 (상태 복원용, 한 번만 등록)
   *
   * 재연결 시에도 자동으로 상태를 복원하기 위해 connect 이벤트 핸들러를
   * 영구적으로 등록합니다. 한 번만 등록되도록 플래그로 체크합니다.
   *
   * hasListeners("connect")를 사용하지 않는 이유:
   * - Promise resolve용 once("connect")와 상태 복원용 on("connect")를 구분하지 못함
   * - once("connect")가 먼저 등록되면 상태 복원 핸들러가 등록되지 않을 수 있음
   */
  private setupConnectHandler(): void {
    if (!this.socket || this.isConnectHandlerBound) {
      return;
    }

    this.isConnectHandlerBound = true;

    this.socket.on("connect", () => {
      if (this.socket) {
        console.log("Chat socket connected:", this.socket.id);

        // 🔥 상태 복원
        this.rejoinRooms();
        this.rebindMessageListeners();

        // 🔥 재연결인 경우에만 복구 팝업 표시
        if (!this.isInitialConnection) {
          useAlertStore.getState().addAlert({
            severity: "success",
            title: "채팅 연결 복구",
            message: "채팅 연결이 복구되었습니다.",
          });
        }
        this.isInitialConnection = false;
      }
    });
  }
}

// 싱글톤 인스턴스
export const chatSocketService = new ChatSocketService();
