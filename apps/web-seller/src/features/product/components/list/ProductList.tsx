import { useNavigate, useParams } from "react-router-dom";
import { IProductItem } from "@/apps/web-seller/features/product/types/product.type";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { EmptyState } from "@/apps/web-seller/common/components/fallbacks/EmptyState";
import { StatusBadge } from "@/apps/web-seller/common/components/badges/StatusBadge";

interface ProductListProps {
  products: IProductItem[];
}

export function ProductList({ products }: ProductListProps) {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();

  const handleProductClick = (productId: string) => {
    if (storeId) {
      navigate(ROUTES.STORE_DETAIL_PRODUCTS_DETAIL(storeId, productId));
    }
  };

  if (products.length === 0) {
    return <EmptyState message="등록된 상품이 없습니다." />;
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const images = product.images || [];

        return (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="group flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            {/* 상품 이미지 - 작게 */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <div className="text-sm font-semibold">{product.name}</div>
                  <div className="flex gap-1">
                    <StatusBadge variant={product.salesStatus === "ENABLE" ? "success" : "default"}>
                      {product.salesStatus === "ENABLE" ? "판매중" : "판매중지"}
                    </StatusBadge>
                    <StatusBadge variant={product.visibilityStatus === "ENABLE" ? "info" : "default"}>
                      {product.visibilityStatus === "ENABLE" ? "노출" : "숨김"}
                    </StatusBadge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>상품번호: {product.id}</span>
                  <span>좋아요 {product.likeCount}</span>
                  <span>{new Date(product.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">
                  {product.salePrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
