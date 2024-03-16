import { getConfig } from "@/config";
import { marked } from "marked";
import * as Prism from "prismjs";
import DOMPurify from "dompurify";
import sanitizeHtml from 'sanitize-html';


export class MarkdownService {
  private static renderer = new marked.Renderer();

  static initialize() {
    // Überschriften
    this.renderer.heading = (text, level) => {
      if (level === 1) {
        return `<h1 class="articles-blog-post-tile fw-900">${text}</h1>`;
      } else if (level === 2) {
        return `<h2 class="articles-content-block-title h1 fw-900">${text}</h2>`;
      } else {
        return `<h${level} class="articles-content-block-title h${level} fw-900">${text}</h${level}>`;
      }
      // Andere Level nach Bedarf
    };

    // Absätze
    this.renderer.paragraph = function (text) {
      return `<p class="articles-blog-post-text font-secondary">${text}</p>`;
    };

    // Listen
    this.renderer.list = function (body, ordered) {
      const type = ordered ? 'ol' : 'ul';
      return ordered ? `<${type} style="list-style-type: decimal" class="listorder font-secondary articles-essentials-list pl-10">${body}</${type}>` : `<${type} class="listorder font-secondary articles-essentials-list pl-10">${body}</${type}>`;
    };

    // Listenpunkte
    this.renderer.listitem = function (text) {
      return `<li>${text}</li>`;
    };

    // Tabelle
    this.renderer.table = (header: string, body: string) => {
      return (
        '<table class="table table-bordered"><thead>' +
        header +
        "</thead><tbody>" +
        body +
        "</tbody></table>"
      );
    };

    // Blockquote
    this.renderer.blockquote = function (quote) {
      return `<blockquote class="articles-blog-post-quote font-secondary">${quote}</blockquote>`;
    };

    // Link
    this.renderer.link = (href: string, title: string, text: string) => {
      if(href.includes(getConfig().baseUrl)) {
          if (title) {
            return `<a href="${href}" title="${
              title ?? ""
            }">${text}</a>`;
          } else { 
            return `<a href="${href}">${text}</a>`;
          }
      } else {
        if (title) {
          return `<a href="${href}" title="${
            title ?? ""
          }" rel="noopener noreferrer" target="_blank">${text}</a>`;
        } else {
          return `<a href="${href}" rel="noopener noreferrer" target="_blank">${text}</a>`;
        }
      }
    };

    // Codeblock
    this.renderer.code = (
      code: string,
      language: string | undefined,
      isEscaped: boolean
    ) => {
      return (
        '<pre class="language-' +
        language +
        '"><code>' +
        Prism.highlight(
          code,
          Prism.languages[language ?? "markup"],
          language ?? "markup"
        ) +
        "</code></pre>"
      );
    };

    // Bilde
    this.renderer.image = (
      href: string | null,
      title: string | null,
      text: string
    ) => {
      if (title != null)
        return (
          '<figure class="figure"><img src="' +
          href +
          '" class="figure-img img-fluid mx-auto d-block" alt="' +
          text +
          '"><figcaption class="figure-caption">' +
          title +
          "</figcaption></figure>"
        );
      else
        return (
          '<img src="' +
          href +
          '" class="img-fluid mx-auto d-block" alt="' +
          text +
          '">'
        );
    };

    // Optionen setzen
    marked.setOptions({ renderer: this.renderer, breaks: true });
  }

  static convert(markdown: string): string {
    const rawHtml = marked.parse(markdown);
    let sanitizedHtml = "";
    if (typeof window !== 'undefined') {
      sanitizedHtml = DOMPurify.sanitize(rawHtml);
    } else {
      sanitizedHtml = rawHtml;
    }
    return sanitizedHtml;
  }

  static convertWithSpacesAndTabs(markdown: string): string {
    const spacesToNbsp = (str: string) =>
      str.replace(/  +/g, (match) => "&nbsp;".repeat(match.length));
    const tabToSpaces = (str: string) =>
      str.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

    const rawHtml = marked.parse(markdown);

    let sanitizedHtml = "";
    if (typeof window !== 'undefined') {
      sanitizedHtml = DOMPurify.sanitize(
        tabToSpaces(spacesToNbsp(rawHtml))
      );
    } else {
      sanitizedHtml = sanitizeHtml(tabToSpaces(spacesToNbsp(rawHtml)));
    }

    return sanitizedHtml;
  }

  static highlightCode(): void {
    Prism.highlightAll();
  }
}

// Initialisierung
MarkdownService.initialize();
