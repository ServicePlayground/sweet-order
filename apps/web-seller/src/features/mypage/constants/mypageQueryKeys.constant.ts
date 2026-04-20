export const mypageQueryKeys = {
  all: ["mypage"] as const,
  profile: () => [...mypageQueryKeys.all, "profile"] as const,
};
