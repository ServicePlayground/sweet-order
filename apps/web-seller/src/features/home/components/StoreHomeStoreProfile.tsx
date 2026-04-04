import React, { useState } from "react";
import {
  Heart,
  Instagram,
  Landmark,
  MessageCircle,
  MessageSquareText,
  Navigation,
  Star,
  Store,
} from "lucide-react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";
import { STORE_BANK_OPTIONS } from "@/apps/web-seller/features/store/constants/store.constants";
import { useStoreDetail } from "@/apps/web-seller/features/store/hooks/queries/useStoreQuery";

function kakaoChannelHref(id: string): string {
  let slug = id.replace(/^@/, "").trim();
  if (!slug.startsWith("_")) slug = `_${slug}`;
  return `https://pf.kakao.com/${slug}`;
}

const snsIconBtn =
  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function StoreProfileSnsIconLinks({
  kakaoChannelId,
  instagramId,
}: {
  kakaoChannelId?: string | null;
  instagramId?: string | null;
}) {
  if (!kakaoChannelId && !instagramId) return null;

  return (
    <div className="flex shrink-0 items-center gap-1">
      {kakaoChannelId ? (
        <a
          href={kakaoChannelHref(kakaoChannelId)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(snsIconBtn, "bg-[#FEE500] text-[#191919] hover:brightness-95")}
          aria-label={`카카오채널 (${kakaoChannelId})`}
          title="카카오채널"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      ) : null}
      {instagramId ? (
        <a
          href={`https://instagram.com/${instagramId.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            snsIconBtn,
            "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white hover:brightness-[1.05]",
          )}
          aria-label={`인스타그램 (@${instagramId.replace(/^@/, "")})`}
          title="인스타그램"
        >
          <Instagram className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      ) : null}
    </div>
  );
}

export interface StoreHomeStoreProfileProps {
  storeId: string;
}

export const StoreHomeStoreProfile: React.FC<StoreHomeStoreProfileProps> = ({ storeId }) => {
  const { data: s, isLoading, isError } = useStoreDetail(storeId);
  const [logoFailed, setLogoFailed] = useState(false);

  const bankLabel =
    s?.bankName != null
      ? (STORE_BANK_OPTIONS.find((o) => o.value === s.bankName)?.label ?? String(s.bankName))
      : "";

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200/90 bg-muted/30 p-8">
        <p className="text-sm text-muted-foreground">스토어 정보를 불러오는 중…</p>
      </section>
    );
  }

  if (isError || !s) {
    return (
      <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
        <p className="text-sm text-destructive">스토어 정보를 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-violet-50/90 via-white to-amber-50/40 shadow-sm ring-1 ring-black/[0.03]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl"
        aria-hidden
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="mx-auto flex w-full max-w-[11.5rem] shrink-0 flex-col items-stretch sm:max-w-[12.5rem] lg:mx-0 lg:max-w-[13rem]">
            <div
              className={cn(
                "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.35rem] bg-white shadow-xl ring-[5px] ring-white lg:rounded-3xl lg:ring-[6px]",
                !logoFailed && s.logoImageUrl ? "ring-violet-100/95" : "ring-zinc-100",
              )}
            >
              {!logoFailed && s.logoImageUrl ? (
                <img
                  src={s.logoImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <Store
                  className="h-[36%] w-[36%] min-h-12 min-w-12 text-zinc-300"
                  strokeWidth={1.25}
                />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-5 lg:pt-0.5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-center gap-2 sm:justify-start sm:gap-2.5">
                <h1 className="min-w-0 text-center text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-left sm:text-3xl">
                  {s.name}
                </h1>
                <StoreProfileSnsIconLinks
                  kakaoChannelId={s.kakaoChannelId}
                  instagramId={s.instagramId}
                />
              </div>
              {s.description ? (
                <p className="max-w-2xl text-center text-sm leading-relaxed text-zinc-600 sm:text-left">
                  {s.description}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-rose-100/90 bg-gradient-to-br from-rose-50/90 to-white/80 px-4 py-3.5 shadow-sm ring-1 ring-rose-100/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Heart className="h-5 w-5 text-rose-600" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-rose-700/90">좋아요</p>
                  <p className="text-xl font-bold tabular-nums tracking-tight text-zinc-900">
                    {s.likeCount.toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-amber-100/90 bg-gradient-to-br from-amber-50/90 to-white/80 px-4 py-3.5 shadow-sm ring-1 ring-amber-100/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-amber-800/90">평균 평점</p>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold tabular-nums tracking-tight text-zinc-900">
                      {s.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs font-medium text-zinc-400">/ 5.0</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-violet-100/90 bg-gradient-to-br from-violet-50/90 to-white/80 px-4 py-3.5 shadow-sm ring-1 ring-violet-100/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <MessageSquareText className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-violet-700/90">전체 리뷰</p>
                  <p className="text-xl font-bold tabular-nums tracking-tight text-zinc-900">
                    {s.totalReviewCount.toLocaleString("ko-KR")}
                    <span className="ml-1 text-sm font-semibold text-zinc-500">건</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="group rounded-xl border border-amber-100/90 bg-gradient-to-b from-amber-50/80 to-white/80 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <Navigation className="h-4 w-4" />
                  </span>
                  픽업 장소
                </div>
                <p className="text-sm font-medium leading-relaxed text-zinc-900">{s.roadAddress}</p>
                {s.detailAddress ? (
                  <p className="mt-1 text-sm text-amber-900/90">{s.detailAddress}</p>
                ) : null}
                <p className="mt-2 text-xs text-zinc-500">우편번호 {s.zonecode}</p>
              </div>

              <div className="group rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/90 text-slate-800">
                    <Landmark className="h-4 w-4" />
                  </span>
                  정산 계좌
                </div>
                <dl className="space-y-2.5 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-zinc-500">은행</dt>
                    <dd className="mt-0.5 font-medium text-zinc-900">{bankLabel || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-zinc-500">계좌번호</dt>
                    <dd className="mt-0.5 font-mono text-xs text-zinc-900 tabular-nums sm:text-sm">
                      {s.bankAccountNumber ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-zinc-500">예금주</dt>
                    <dd className="mt-0.5 font-medium text-zinc-900">
                      {s.accountHolderName ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
