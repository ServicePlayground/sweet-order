import { QueryClient } from "@tanstack/react-query";

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 stale로 간주되는 시간 (5분)
      staleTime: 5 * 60 * 1000,
      // 캐시에서 데이터를 유지하는 시간 (10분)
      gcTime: 10 * 60 * 1000,
      // 자동으로 데이터를 다시 가져오는 간격 (비활성)
      refetchInterval: false,
      // 윈도우 포커스 시 자동 리페치
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 리페치
      refetchOnReconnect: true,
      // 에러 발생 시 재시도 횟수
      retry: 0,
    },
    mutations: {
      // 뮤테이션 에러 발생 시 재시도 횟수
      retry: 0,
    },
  },
});
