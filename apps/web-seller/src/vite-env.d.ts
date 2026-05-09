/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_NODE_ENV: string;
  readonly VITE_PUBLIC_API_DOMAIN: string;
  readonly VITE_PUBLIC_GOOGLE_CLIENT_ID: string;
  readonly VITE_PUBLIC_KAKAO_RESTAPI_KEY: string;
  readonly VITE_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
  readonly VITE_PUBLIC_GITHUB_SHA: string;
  readonly VITE_PUBLIC_GITHUB_REF_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
