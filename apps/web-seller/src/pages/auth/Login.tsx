import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { AuthCardLayout } from "@/apps/web-seller/common/components/layouts/AuthCardLayout";
import googleIcon from "@/apps/web-seller/assets/images/google.png";
import kakaoIcon from "@/apps/web-seller/assets/images/kakaotalk.png";

export function LoginPage() {
  return (
    <AuthCardLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-[1.65rem] font-bold tracking-tight text-zinc-900 sm:text-[1.75rem]">
            로그인
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">Picake 판매자 센터</p>
        </div>

        <a
          href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}${ROUTES.AUTH.GOOGLE_REDIRECT_URI}&response_type=code&scope=email+profile&prompt=select_account`}
          className="group flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white text-[15px] font-semibold text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        >
          <img src={googleIcon} alt="" width={20} height={20} className="block shrink-0" />
          Google로 계속하기
        </a>

        <a
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_PUBLIC_KAKAO_RESTAPI_KEY}&redirect_uri=${window.location.origin}${ROUTES.AUTH.KAKAO_REDIRECT_URI}&response_type=code`}
          className="group flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#F7E600] bg-[#FEE500] text-[15px] font-semibold text-[#191919] shadow-sm transition-colors hover:bg-[#f7de00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
        >
          <img src={kakaoIcon} alt="" width={20} height={20} className="block shrink-0" />
          Kakao로 계속하기
        </a>

        <div className="flex justify-center border-t border-zinc-100 pt-2">
          <Link
            to={ROUTES.AUTH.FIND_ACCOUNT}
            className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            계정 찾기
            <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
          </Link>
        </div>
      </div>
    </AuthCardLayout>
  );
}
