"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/apps/web-user/common/config/query-client";
import { setQueryClient } from "@/apps/web-user/common/config/axios.config";
import { useEffect } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient를 query hook을 사용하지 않고, axios 직접 호출하여 query와 연동하여 사용하기 위해 설정
  useEffect(() => {
    setQueryClient(queryClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
