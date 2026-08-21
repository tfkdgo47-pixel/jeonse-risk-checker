import Link from "next/link";
import JeonseRiskForm from "@/components/calculators/jeonseRisk/JeonseRiskForm";

// 같은 ourcalctools.com 패밀리의 다른 사이트들.
const FAMILY_SITES = [
  { href: "https://ourcalctools.com", label: "아기 개월수 계산기" },
  { href: "https://fortune.ourcalctools.com", label: "오늘의 나" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-3xl shadow-lg shadow-brand-300/40">
          🔑
        </div>
        <h1 className="font-display mt-4 text-3xl text-slate-900 sm:text-4xl">
          우리집 전세, 안전할까?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          전세보증금과 주변 실거래가를 비교해 전세가율과 위험 등급을{" "}
          <span className="font-bold text-gold-600">1분 만에</span> 알려드려요.
          입력한 정보는 서버에 저장되지 않아요.
        </p>
        <Link
          href="/checklist"
          className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline"
        >
          📋 전세 계약 체크리스트 보기 →
        </Link>
      </section>

      <section className="mt-10">
        <JeonseRiskForm />
      </section>

      <section className="mt-12 border-t border-slate-100 pt-6 text-center">
        <p className="text-sm text-slate-500">이런 계산기도 있어요</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          {FAMILY_SITES.map((site) => (
            <a
              key={site.href}
              href={site.href}
              className="font-bold text-brand-600 hover:underline"
            >
              {site.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
