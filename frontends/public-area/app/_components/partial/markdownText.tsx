"use client"

import { MarkdownService } from "@/app/_services/markdown.service";
import { useEffect } from "react";

export default function MarkdownText({ text }: { text: string | null }) {

  let htmlText = "";
  if (text) htmlText = MarkdownService.convert(text);

  useEffect(() => {
    if(window !== undefined) {
      (window as any).MathJax?.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          processEscapes: true,
        },
      });
      
      (window as any).MathJax?.Hub.Queue([
        "Typeset",
        (window as any).MathJax?.Hub,
      ]);
    }
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>
};