import { DocumentBuilder } from "@nestjs/swagger";

const commonSwaggerConfig = (title: string) => {
  return new DocumentBuilder()
    .setTitle(title)
    .setVersion("1.0.0")
    .setDescription(
      `
      🔐 인증 방식 안내
      
      헤더 기반 인증을 사용합니다. Authorization 헤더에 Bearer 토큰을 포함하여 요청하세요.
      
      ⚠️ 중요: Swagger UI의 "Authorize" 버튼에서 토큰을 입력할 때는 "Bearer " 접두사 없이 토큰만 입력하세요.
      예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Swagger UI가 자동으로 "Bearer "를 추가합니다)
      
      로그인/회원가입 API를 통해 accessToken과 refreshToken을 발급받을 수 있습니다.
      로그인이 필요한 API에는 (로그인 필요) 표시가 되어 있습니다.
      
      Swagger UI 우측 상단의 "Authorize" 버튼을 클릭하여 토큰을 입력하면 모든 API 요청에 자동으로 포함됩니다.
    `,
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "JWT 토큰만 입력하세요 (Bearer 접두사 제외). 예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        in: "header",
      },
      "JWT-auth", // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
};

export const userSwaggerConfig = commonSwaggerConfig("Sweet Order - User API");

export const sellerSwaggerConfig = commonSwaggerConfig("Sweet Order - Seller API");

export const adminSwaggerConfig = commonSwaggerConfig("Sweet Order - Admin API");
