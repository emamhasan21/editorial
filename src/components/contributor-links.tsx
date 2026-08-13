import Link from "next/link";
import type { ContributorDTO } from "@/data/library";

const roleLabels: Record<ContributorDTO["role"], string> = {
  author: "Author", co_author: "Co-author", translator: "Translator", editor: "Editor",
  compiler: "Compiler", illustrator: "Illustrator", introduction: "Introduction",
  researcher: "Researcher", photographer: "Photographer", narrator: "Narrator", rights_holder: "Rights holder",
};

export function ContributorLinks({ contributors, fallback }: { contributors: ContributorDTO[]; fallback?: string }) {
  if (!contributors.length) return fallback ? <span>{fallback}</span> : null;
  return <span>{contributors.map((person, index) => <span key={`${person.id}-${person.role}`}>{index > 0 && ", "}<Link href={`/writers/${person.slug}`} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">{person.customByline || person.name}</Link>{person.role !== "author" && <span className="text-muted-foreground"> · {roleLabels[person.role]}</span>}</span>)}</span>;
}
