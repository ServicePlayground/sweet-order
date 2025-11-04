import StoreDetail from "@/apps/web-user/features/store/components/StoreDetail";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  return <StoreDetail storeId={storeId} />;
}
