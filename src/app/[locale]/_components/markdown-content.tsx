"use client"

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkDownContentProps {
  markdown: string;
}

export default function MarkDownContent({ markdown }: MarkDownContentProps) {
  return (
    <div className='
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4
    [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-3
    [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mb-2
    [&_h5]:text-base [&_h5]:font-semibold
    [&_p]:mb-4 [&_p]:leading-relaxed
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
    [&_li]:mb-1
  [&_a]:text-sky-800 [&_a]:underline [&_a]:hover:text-sky-950
    [&_strong]:font-semibold
    [&_em]:italic
    [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
    [&_hr]:my-6 [&_hr]:border-t
  [&_code]:bg-gray-100 [&_code]:text-sm [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-rose-600
  [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:text-sm [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:mb-6
    [&_table]:table [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
    [&_th]:text-left [&_th]:border-b [&_th]:py-2 [&_th]:px-2 [&_th]:font-medium
    [&_td]:border-b [&_td]:py-2 [&_td]:px-2
    '>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
