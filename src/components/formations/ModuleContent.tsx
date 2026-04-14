import ReactMarkdown from "react-markdown";

interface ModuleContentProps {
  content: string;
}

export default function ModuleContent({ content }: ModuleContentProps) {
  return (
    <div className="prose prose-invert prose-violet max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 font-display">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mt-8 mb-3 font-display">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-[#C8C8D8] leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-[#C8C8D8] mb-4 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-[#C8C8D8] mb-4 ml-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[#C8C8D8]">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-violet-300">{children}</em>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-[#0A0A0F] border border-white/[0.06] rounded-lg p-4 text-sm font-mono text-cyan-300 overflow-x-auto mb-4">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-white/[0.06] text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[#0A0A0F] border border-white/[0.06] rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-violet-500 pl-4 italic text-[#8A8AA3] my-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
