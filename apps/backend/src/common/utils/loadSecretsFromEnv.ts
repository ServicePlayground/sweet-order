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
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = String(value);
      }
    }
    console.log("Secrets loaded into process.env");
  } catch (e) {
    console.warn("Failed to parse SECRETS_ARN JSON:", e);
  }
};
