// 배포 환경(staging, production)에서는 AWS App Runner(AWS Secrets Manager)에서 환경변수 추가하여, 런타임시 주입하도록 함(자세한 사항은 환경변수 - 가이드.md 참고)
// Secrets JSON(SECRETS_ARN)을 파싱해서 process.env로 주입합니다.
export const loadSecretsFromEnv = (): void => {
  const raw = process.env.SECRETS_ARN;
  if (!raw) {
    console.warn("No SECRETS_ARN environment variable found");
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const loadedKeys: string[] = [];
    
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = String(value);
        loadedKeys.push(key);
      }
    }
    
    console.log(`Secrets loaded into process.env - ${loadedKeys.length} keys loaded:`, loadedKeys);
    
    // Google OAuth 관련 환경변수 확인
    const googleKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'PUBLIC_USER_DOMAIN'];
    const missingGoogleKeys = googleKeys.filter(key => !process.env[key]);
    if (missingGoogleKeys.length > 0) {
      console.error("Missing Google OAuth environment variables:", missingGoogleKeys);
    } else {
      console.log("All Google OAuth environment variables are loaded");
    }
  } catch (e) {
    console.warn("Failed to parse SECRETS_ARN JSON:", e);
  }
};
