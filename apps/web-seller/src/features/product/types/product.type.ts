export enum MainCategory {
  CAKE = "CAKE", // 케이크
  SUPPLY = "SUPPLY", // 용품
  OTHER = "OTHER", // 기타
}

export interface IProductForm {
  mainCategory: MainCategory | "";
  imageUrls: string[];
  name: string;
}

