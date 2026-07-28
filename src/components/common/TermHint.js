import Link from "next/link";
import { findGlossaryTerm } from "@/lib/data/glossary";

// 어려운 용어 아래 붙이는 작은 설명 캡션. 용어 전체 설명은 /glossary 페이지로
// 링크한다(같은 glossary.js 데이터를 재사용해 설명이 어긋나지 않게 한다).
export default function TermHint({ termId }) {
  const term = findGlossaryTerm(termId);
  if (!term) return null;

  return (
    <p className="mt-1 text-xs leading-relaxed text-slate-400">
      💡 <strong className="font-semibold text-slate-500">{term.term}</strong>
      {": "}
      {term.shortDef}.{" "}
      <Link href={`/glossary#${term.id}`} className="text-brand-500 underline">
        용어 자세히 보기
      </Link>
    </p>
  );
}
