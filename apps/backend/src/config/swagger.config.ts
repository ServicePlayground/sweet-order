import { DocumentBuilder } from "@nestjs/swagger";

const commonSwaggerConfig = (title: string) => {
  return new DocumentBuilder()
    .setTitle(title)
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}',
        in: "header",
      },
      "JWT-auth",
    )
    .build();
};

export const userSwaggerConfig = commonSwaggerConfig("Sweet Order - User API");

export const sellerSwaggerConfig = commonSwaggerConfig("Sweet Order - Seller API");

export const adminSwaggerConfig = commonSwaggerConfig("Sweet Order - Admin API");
