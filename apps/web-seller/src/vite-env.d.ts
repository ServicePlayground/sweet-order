/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_NODE_ENV: string;
  readonly VITE_PUBLIC_API_DOMAIN: string;
  readonly VITE_PUBLIC_KAKAO_RESTAPI_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
