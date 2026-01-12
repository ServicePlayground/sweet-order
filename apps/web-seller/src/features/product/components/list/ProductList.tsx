import { useNavigate } from "react-router-dom";
import { IProductItem } from "@/apps/web-seller/features/product/types/product.type";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

interface ProductListProps {
  products: IProductItem[];
  storeId: string;
}

export function ProductList({ products, storeId }: ProductListProps) {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    // 상품 상세 페이지로 이동 (필요시 구현)
    // navigate(ROUTES.PRODUCT_DETAIL(productId));
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const images = product.mainImage
          ? [product.mainImage, ...(product.additionalImages || [])]
          : [];

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
                    {/* 판매 상태 배지 */}
                    {product.salesStatus === "ENABLE" ? (
                      <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                        판매중
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs font-medium text-white">
                        판매중지
                      </span>
                    )}
                    {/* 노출 상태 배지 */}
                    {product.visibilityStatus === "ENABLE" ? (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                        노출
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs font-medium text-white">
                        숨김
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>상품번호: {product.id}</span>
                  <span>좋아요 {product.likeCount}</span>
                  <span>
                    {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                  </span>
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




