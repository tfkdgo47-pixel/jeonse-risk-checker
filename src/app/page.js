import Link from "next/link";
import JeonseRiskForm from "@/components/calculators/jeonseRisk/JeonseRiskForm";

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
    </div>
  );
}
