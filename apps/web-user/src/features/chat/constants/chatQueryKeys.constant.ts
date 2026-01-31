export const chatQueryKeys = {
  all: ["chat"] as const,
  lists: () => ["chat", "list"] as const,
  list: () => ["chat", "list"] as const,
  details: () => ["chat", "detail"] as const,
  detail: (roomId: string) => ["chat", "detail", roomId] as const,
  messages: (roomId: string) => ["chat", "detail", roomId, "messages"] as const,
};
