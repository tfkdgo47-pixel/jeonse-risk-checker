import Link from "next/link";
import JeonseChecklist from "@/components/checklist/JeonseChecklist";

export const metadata = {
  title: "전세 계약 체크리스트 | 깡통전세 위험 진단기",
  description:
    "전세 계약 전 확인할 것부터 계약 기간 중, 퇴거할 때 챙겨야 할 것까지 체크리스트로 정리했어요.",
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-3xl shadow-lg shadow-brand-300/40">
          📋
        </div>
        <h1 className="font-display mt-4 text-3xl text-slate-900 sm:text-4xl">
          전세 계약 체크리스트
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          계약 전 등기부등본 확인부터, 계약 기간 중 갱신·신고, 퇴거할 때
          보증금 반환까지 놓치기 쉬운 항목을 순서대로 확인해보세요.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline"
        >
          ← 전세가율 계산기로 돌아가기
        </Link>
      </section>

      <section className="mt-10">
        <JeonseChecklist />
      </section>
    </div>
  );
}
