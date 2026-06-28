import { cn } from "@/lib/utils";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  const blocks = content.trim().split(/\n\n+/);

  return (
    <div className={cn("space-y-3 leading-relaxed text-muted", className)}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter(Boolean);

        if (lines.every((line) => /^[-*]\s/.test(line))) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {renderInline(line.replace(/^[-*]\s/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        if (lines[0]?.startsWith("## ")) {
          return (
            <h3
              key={blockIndex}
              className="text-base font-semibold text-foreground"
            >
              {renderInline(lines[0].slice(3))}
            </h3>
          );
        }

        return (
          <p key={blockIndex}>{renderInline(lines.join(" "))}</p>
        );
      })}
    </div>
  );
}
