import Link from "next/link";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";

export const metadata = {
  title: "전세 용어 사전 | 깡통전세 위험 진단기",
  description: "전세 계약에서 자주 나오는 어려운 용어들을 쉽게 풀어서 설명해요.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-3xl shadow-lg shadow-brand-300/40">
          📖
        </div>
        <h1 className="font-display mt-4 text-3xl text-slate-900 sm:text-4xl">
          전세 용어 사전
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          계약서와 등기부등본에 자주 나오는 어려운 말들을 쉽게 풀어봤어요.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-bold text-brand-600 hover:underline"
        >
          ← 전세가율 계산기로 돌아가기
        </Link>
      </section>

      <section className="mt-10 space-y-4">
        {GLOSSARY_TERMS.map((term) => (
          <div
            key={term.id}
            id={term.id}
            className="scroll-mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-brand-100/40"
          >
            <p className="font-display text-lg text-slate-900">{term.term}</p>
            <p className="mt-1 text-sm font-medium text-brand-600">{term.shortDef}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{term.longDef}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
