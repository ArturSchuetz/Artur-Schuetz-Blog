"use client";
import { getConfig } from "@/config";
import articlestyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  createTutorialArticle,
  getPaginatedTutorialArticles,
  Author,
  TutorialArticle,
  deleteTutorialArticle,
  publishTutorialArticle,
} from "@/app/_services/tutorial-article.service";
import UnauthorizedException from "../../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";

export default function TutorialsList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [articles, setTutorialArticles] = useState<TutorialArticle[]>([]);
  const [articleDrafts, setTutorialArticleDrafts] = useState<TutorialArticle[]>([]);
  const [publishedTutorialArticles, setPublishedTutorialArticles] = useState<TutorialArticle[]>([]);

  useEffect(() => {
    getPaginatedTutorialArticles(1, 9999)
      .then((paginatedTutorialArticles) => {
        if (paginatedTutorialArticles) {
          setTutorialArticles(paginatedTutorialArticles.data);
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
    setPublishedTutorialArticles(articles.filter((article) => article.isPublished));
    setTutorialArticleDrafts(articles.filter((article) => !article.isPublished));
  }, [articles]);

  const handleCreateTutorialArticle = () => {
    const newTutorialArticle: TutorialArticle = {
      id: 0,
      position: 0,
      title: "",
      slug: "",
      shortTitle: "",
      text: "",
      previewHostedVideoUrl: null,
      previewMediaId: null,
      previewText: "",
      tags: "",
      chapter: null,
      chapterId: null,
      useMathJax: false,
      isPublished: false,
      releasedAt: null,
      updatedAt: null,
      views: 0,
      author: {} as Author,
      medias: null,
    };
    createTutorialArticle(newTutorialArticle)
      .then((createdTutorialArticle) => {
        setTutorialArticles((prevTutorialArticles) => [...prevTutorialArticles, createdTutorialArticle]);
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
      publishTutorialArticle(articleId)
        .then((publishedTutorialArticle) => {
          setTutorialArticles((prevTutorialArticles) => {
            const articleIndex = prevTutorialArticles.findIndex(
              (article) => article.id === articleId
            );

            if (articleIndex === -1) {
              return prevTutorialArticles;
            }

            const updatedTutorialArticles = [...prevTutorialArticles];
            updatedTutorialArticles[articleIndex] = publishedTutorialArticle;

            return updatedTutorialArticles;
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
      deleteTutorialArticle(articleId)
        .then((success) => {
          if (success) {
            setTutorialArticles((prevTutorialArticles) =>
              prevTutorialArticles.filter((article) => article.id !== articleId)
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
                <h1 className="page-title">Tutorial Articles</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tutorial Articles
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
                        onClick={handleCreateTutorialArticle}
                      >
                        {" "}
                        Add New Tutorial Article
                      </button>


                      {articles && articles.length > 0 && (
                        <div className="table-responsive">
                          <table className="table table-bordered border text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th style={{width: 0}}>ID</th>
                                <th style={{width: 0}}>Pos</th>
                                <th>Title</th>
                                <th>Chapter</th>
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
                              {articles.map((article) => (
                                <tr key={article.id}>
                                  <td>{article.id}</td>
                                  <td>{article.position}</td>
                                  <td><Link href={`${getConfig().baseUrl}/tutorials/article/${article.slug
                                    }`}>{article.title}</Link></td>
                                  <td>{article.chapter?.name}</td>
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
                                      href={`/tutorials/articles/edit/${article.id}`}
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
      )}
    </>
  );
}
