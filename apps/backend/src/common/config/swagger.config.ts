import { DocumentBuilder } from "@nestjs/swagger";

const commonSwaggerConfig = (title: string) => {
  return new DocumentBuilder()
    .setTitle(title)
    .setVersion("1.0.0")
    .setDescription(
      `
      🔐 인증 방식 안내
      
      쿠키 기반 인증을 사용합니다. Swagger UI는 쿠키 인증을 제대로 지원하지 않아 인증 기능을 제공할 수 없습니다.
      
      로그인이 필요한 API에는 (로그인 필요) 표시가 되어 있습니다.
    `,
    )
    .build();
};

export const userSwaggerConfig = commonSwaggerConfig("Sweet Order - User API");

export const sellerSwaggerConfig = commonSwaggerConfig("Sweet Order - Seller API");

export const adminSwaggerConfig = commonSwaggerConfig("Sweet Order - Admin API");
