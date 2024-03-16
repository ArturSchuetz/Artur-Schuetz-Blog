/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getConfig } from "@/config";

import { BlogArticle } from "@/app/_services/blog-article.service";

export default function PostListItem({ article }: { article: BlogArticle }) {
  var seconds = article.releasedAt
    ? (Date.now() - new Date(article.releasedAt).getTime()) / 1000
    : 0;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var weeks = days / 7;
  var months = days / 30.4167;
  var years = days / 365;

  const isNewArticle = weeks <= 1;

  let postetTimespan = "";
  if (years >= 1) postetTimespan = String(years.toFixed(0)) + " years ago";
  else if (months >= 1)
    postetTimespan = String(months.toFixed(0)) + " months ago";
  else if (weeks >= 1) postetTimespan = String(weeks.toFixed(0)) + " weeks ago";
  else if (days >= 1) postetTimespan = String(days.toFixed(0)) + " days ago";
  else if (hours >= 1) postetTimespan = String(hours.toFixed(0)) + " hours ago";
  else if (minutes >= 1)
    postetTimespan = String(minutes.toFixed(0)) + " minutes ago";
  else postetTimespan = String(seconds.toFixed(0)) + " seconds ago";

  return (
    <article className={`${article.category?.color}-article`}>
      {article.previewHostedVideoUrl && (
        <div className="articles-preview-vimeo">
          <iframe
            className=" w-full h-full"
            src={`${article.previewHostedVideoUrl}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {article.previewMediaId && !article.previewHostedVideoUrl && (
        <img
          className="img-fluid"
          src={`${getConfig().apiUrl}/medias/${article.previewMediaId}?w=696`}
          alt={article.title}
        />
      )}
      <div className="articles-header">
        <time
          dateTime={
            article.releasedAt ? new Date(article.releasedAt).toISOString() : ""
          }
        >
          {postetTimespan}
        </time>
        {isNewArticle && <span className="articles-header-tag-green">New</span>}
        <span className="articles-header-category">
          <Link
            href={`/blog/category/${article.category?.slug}/page/1`}
            className={article.category?.color}
            title={article.category?.name}
          >
            {article.category?.name}
          </Link>
        </span>
      </div>
      <div className="articles-content">
        <h2>
          <Link href={`/blog/article/${article.slug}`} title={article.title}>
            {article.title}
          </Link>
        </h2>
        <p className="font-secondary articles-content-text">
          {article.previewText}
        </p>
      </div>
      <div className="articles-footer">
        <Link title="" className="btn" href={`/blog/article/${article.slug}`}>
          Read more
        </Link>
      </div>
    </article>
  );
}
