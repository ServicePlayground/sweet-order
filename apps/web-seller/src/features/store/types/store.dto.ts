/**
 * 스토어 API 타입 (백엔드 store DTO와 1:1 정합)
 * - 단일: StoreResponseDto
 * - 목록: GetSellerStoresRequestDto, StoreListResponseDto
 * - CRUD: CreateStoreRequestDto, CreateStoreResponseDto, UpdateStoreRequestDto
 */

import type { ListResponseDto } from "@/apps/web-seller/common/types/api.dto";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@/apps/web-seller/features/business/types/business.dto";

export enum StoreSortBy {
  LATEST = "latest",
  POPULAR = "popular",
}

/** 주소 정보 (백엔드 StoreAddressDto) */
export interface StoreAddressDto {
  address: string;
  roadAddress: string;
  detailAddress: string;
  zonecode: string;
  latitude: number;
  longitude: number;
}

export interface StoreResponseDto extends StoreAddressDto {
  id: string;
  userId: string;
  logoImageUrl?: string | null;
  name: string;
  description?: string | null;
  businessNo: string;
  representativeName: string;
  openingDate: string;
  businessName: string;
  businessSector: string;
  businessType: string;
  permissionManagementNumber: string;
  likeCount: number;
  isLiked?: boolean | null;
  averageRating: number;
  totalReviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/** 스토어 생성 요청 (3단계: 사업자진위 + 통신판매 + 스토어정보) */
export interface CreateStoreRequestDto extends StoreAddressDto {
  businessValidation: BusinessValidationRequestDto;
  onlineTradingCompanyDetail: OnlineTradingCompanyDetailRequestDto;
  name: string;
  description?: string;
  logoImageUrl?: string;
}

export interface CreateStoreResponseDto {
  id: string;
}

export interface UpdateStoreRequestDto extends StoreAddressDto {
  name: string;
  description?: string;
  logoImageUrl?: string;
}

export interface UpdateStoreResponseDto {
  id: string;
}

/** 판매자용 스토어 목록 조회 요청 (백엔드 GetSellerStoresRequestDto) */
export interface GetSellerStoresRequestDto {
  page: number;
  limit: number;
  search?: string;
  sortBy?: StoreSortBy;
}

export type StoreListResponseDto = ListResponseDto<StoreResponseDto>;
