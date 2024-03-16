"use client";
import { getConfig } from "@/config";
import articlestyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  createBlogArticle,
  getPaginatedBlogArticles,
  Author,
  BlogArticle,
  deleteBlogArticle,
  publishBlogArticle,
} from "@/app/_services/blog-article.service";
import UnauthorizedException from "../../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

export default function BlogList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [articles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [articleDrafts, setBlogArticleDrafts] = useState<BlogArticle[]>([]);
  const [publishedBlogArticles, setPublishedBlogArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    getPaginatedBlogArticles(1, 9999)
      .then((paginatedBlogArticles) => {
        if (paginatedBlogArticles) {
          setBlogArticles(paginatedBlogArticles.data);
        }
      })
      .catch((error) => {
        if (error instanceof UnauthorizedException) {
          console.error("Unauthorized!");
          router.push("/login");
          return;
        } else {
          console.error(error);
        }
      });
  }, [router]);

  useEffect(() => {
    setPublishedBlogArticles(articles.filter((article) => article.isPublished));
    setBlogArticleDrafts(articles.filter((article) => !article.isPublished));
  }, [articles]);

  const handleCreateBlogArticle = () => {
    const newBlogArticle: BlogArticle = {
      id: 0,
      title: "",
      slug: "",
      text: "",
      titlePageImageId: null,
      previewHostedVideoUrl: null,
      previewMediaId: null,
      previewText: "",
      advertisement: "",
      tags: "",
      category: null,
      categoryId: null,
      previousArticle: null,
      previousArticleId: null,
      nextArticle: null,
      nextArticleId: null,
      useMathJax: false,
      isPublished: false,
      releasedAt: null,
      updatedAt: null,
      views: 0,
      author: {} as Author,
      medias: null,
    };
    createBlogArticle(newBlogArticle)
      .then((createdBlogArticle) => {
        setBlogArticles((prevBlogArticles) => [...prevBlogArticles, createdBlogArticle]);
      })
      .catch((error) => {
        if (error instanceof UnauthorizedException) {
          console.error("Unauthorized!");
          router.push("/login");
          return;
        } else {
          console.error(error);
        }
      });
  };

  const handlePublishRequest = (articleId: number) => {
    if (window.confirm("Are you sure you want to publish this article?")) {
      publishBlogArticle(articleId)
        .then((publishedBlogArticle) => {
          setBlogArticles((prevBlogArticles) => {
            const articleIndex = prevBlogArticles.findIndex(
              (article) => article.id === articleId
            );

            if (articleIndex === -1) {
              return prevBlogArticles;
            }

            const updatedBlogArticles = [...prevBlogArticles];
            updatedBlogArticles[articleIndex] = publishedBlogArticle;

            return updatedBlogArticles;
          });
        })
        .catch((error) => {
          if (error instanceof UnauthorizedException) {
            console.error("Unauthorized!");
            router.push("/login");
            return;
          } else {
            console.error(error);
          }
        });
    }
  };

  const handleDeleteRequest = (articleId: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteBlogArticle(articleId)
        .then((success) => {
          if (success) {
            setBlogArticles((prevBlogArticles) =>
              prevBlogArticles.filter((article) => article.id !== articleId)
            );
          }
        })
        .catch((error) => {
          if (error instanceof UnauthorizedException) {
            console.error("Unauthorized!");
            router.push("/login");
            return;
          } else {
            console.error(error);
          }
        });
    }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">Blog Articles</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Blog Articles
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row row-sm">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <button
                        className="btn btn-primary mb-4"
                        onClick={handleCreateBlogArticle}
                      >
                        {" "}
                        Add New Blog Article
                      </button>

                      <div className=" tab-menu-heading">
                          <div className="tabs-menu1">
                              <ul className="nav panel-tabs">
                                  <li><a href="#drafts_tab" className="active" data-bs-toggle="tab">Drafts</a></li>
                                  <li><a href="#published_tab" data-bs-toggle="tab">Published</a></li>
                              </ul>
                          </div>
                      </div>
                      <div className="panel-body tabs-menu-body">
                        <div className="tab-content">
                          <div className="tab-pane active" id="drafts_tab">
                            {articleDrafts && articleDrafts.length > 0 && (
                              <div className="table-responsive">
                                <table className="table table-bordered border text-nowrap mb-0">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Title</th>
                                      <th>Is Published</th>
                                      <th>Released At</th>
                                      <th>Views</th>
                                      <th>Author</th>
                                      <th
                                        className={`bstable-actions ${articlestyles.buttonColumn}`}
                                      >
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {articleDrafts.map((article) => (
                                        <tr key={article.id}>
                                          <td>{article.id}</td>
                                          <td><Link href={`${getConfig().baseUrl}/blog/article/${
                                                  article.slug
                                                }`}>{article.title}</Link></td>
                                          <td>{article.isPublished ? "Yes" : "No"}</td>
                                          <td>
                                            {article.releasedAt &&
                                              new Date(
                                                article.releasedAt
                                              ).toLocaleDateString()}
                                          </td>
                                          <td>{article.views}</td>
                                          <td>
                                            {article.author &&
                                              article.author.firstName +
                                                " " +
                                                article.author.lastName}
                                          </td>
                                          <td>
                                            {!article.isPublished && (
                                              <button
                                                className={`btn btn-success btn-sm  ${articlestyles.editButtonMargin} ${articlestyles.smallButton}`}
                                                onClick={() =>
                                                  handlePublishRequest(article.id)
                                                }
                                              >
                                                <i className="fa fa-paper-plane"></i>
                                              </button>
                                            )}
                                            <Link
                                              href={`/blog/articles/edit/${article.id}`}
                                              className={`btn btn-primary btn-sm ${articlestyles.editButtonMargin} ${articlestyles.smallButton}`}
                                            >
                                              <i className="fa fa-edit"></i>
                                            </Link>
                                            <button
                                              className={`btn btn-danger btn-sm ${articlestyles.smallButton}`}
                                              onClick={() =>
                                                handleDeleteRequest(article.id)
                                              }
                                            >
                                              <i className="fa fa-trash"></i>
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                          <div className="tab-pane" id="published_tab">
                            {publishedBlogArticles  && publishedBlogArticles.length > 0 && (
                              <div className="table-responsive">
                                <table className="table table-bordered border text-nowrap mb-0">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Title</th>
                                      <th>Is Published</th>
                                      <th>Released At</th>
                                      <th>Views</th>
                                      <th>Author</th>
                                      <th
                                        className={`bstable-actions ${articlestyles.buttonColumn}`}
                                      >
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {publishedBlogArticles.map((article) => (
                                        <tr key={article.id}>
                                          <td>{article.id}</td>
                                          <td><Link href={`${getConfig().baseUrl}/blog/article/${
                                                  article.slug
                                                }`}>{article.title}</Link></td>
                                          <td>{article.isPublished ? "Yes" : "No"}</td>
                                          <td>
                                            {article.releasedAt &&
                                              new Date(
                                                article.releasedAt
                                              ).toLocaleDateString()}
                                          </td>
                                          <td>{article.views}</td>
                                          <td>
                                            {article.author &&
                                              article.author.firstName +
                                                " " +
                                                article.author.lastName}
                                          </td>
                                          <td>
                                            {!article.isPublished && (
                                              <button
                                                className={`btn btn-success btn-sm  ${articlestyles.editButtonMargin} ${articlestyles.smallButton}`}
                                                onClick={() =>
                                                  handlePublishRequest(article.id)
                                                }
                                              >
                                                <i className="fa fa-paper-plane"></i>
                                              </button>
                                            )}
                                            <Link
                                              href={`/blog/articles/edit/${article.id}`}
                                              className={`btn btn-primary btn-sm ${articlestyles.editButtonMargin} ${articlestyles.smallButton}`}
                                            >
                                              <i className="fa fa-edit"></i>
                                            </Link>
                                            <button
                                              className={`btn btn-danger btn-sm ${articlestyles.smallButton}`}
                                              onClick={() =>
                                                handleDeleteRequest(article.id)
                                              }
                                            >
                                              <i className="fa fa-trash"></i>
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
