// ambient 예시
declare module "*.svg" {
  const content: string;
  export default content;
}

export interface UserProfile {
  id: string;
  role: "user" | "seller" | "admin";
  email: string;
}
