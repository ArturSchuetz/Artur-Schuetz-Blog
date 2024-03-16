"use client";
import articletyles from "./style.module.css";
import "@/public/iconfonts/materialdesignicons/materialdesignicons.css";
import "react-color-palette/css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import FileUpload from "@/app/_components/_partials/FileUpload";

import {
  getTutorialArticleById,
  updateTutorialArticleImage,
  TutorialArticle,
  Author,
  updateTutorialArticle,
  getPaginatedTutorialArticles,
  publishTutorialArticle,
} from "@/app/_services/tutorial-article.service";
import { deleteMedia } from "@/app/_services/media.service";
import { TutorialChapter, getTutorialChapters } from "@/app/_services/tutorial-chapter.service";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function EditTutorialArticle({
  params,
}: {
  params: { articleId: number };
}) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const articleId = params.articleId;
  const [article, setTutorialArticle] = useState<TutorialArticle>({
    id: 0,
    position: 0,
    title: "",
    slug: "",
    shortTitle: "",
    text: "",
    previewHostedVideoUrl: null,
    previewMediaId: null,
    previewText: null,
    tags: null,
    chapter: null,
    chapterId: null,
    useMathJax: false,
    isPublished: false,
    releasedAt: 0,
    updatedAt: 0,
    views: 0,
    author: {} as Author,
    medias: [],
  });
  const [categories, setTutorialChapters] = useState<TutorialChapter[]>([]);
  const [articles, setTutorialArticles] = useState<TutorialArticle[]>([]);

  useEffect(() => {
    getTutorialChapters()
      .then((fetchedTutorialChapters) => {
        setTutorialChapters(fetchedTutorialChapters);
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

    getPaginatedTutorialArticles(1, 9999)
      .then((paginaarticlestedTutorialArticles) => {
        if (paginaarticlestedTutorialArticles) {
          setTutorialArticles(
            paginaarticlestedTutorialArticles.data.filter(
              (article) => Number(article.id) !== Number(articleId)
            )
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
  }, [articleId, router]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case "s":
            event.preventDefault();
            const updatedTutorialArticle = { ...article };
            updateTutorialArticle(updatedTutorialArticle)
              .then((updatedTutorialArticleResponse) => {
                setTutorialArticle(updatedTutorialArticleResponse);
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
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [article, router]);

  useEffect(() => {
    getTutorialArticleById(articleId)
      .then((fetchedTutorialArticle) => {
        setTutorialArticle(fetchedTutorialArticle);
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
  }, [articleId, router]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const numberFields = [
      "titlePageImageId",
      "previewMediaId",
      "chapterId",
      "previousTutorialArticleId",
      "nextTutorialArticleId",
      "releasedAt",
      "views",
    ];

    // Felder, die Booleans sein sollten
    const booleanFields = ["useMathJax", "isPublished"];

    let newValue: string | number | boolean | null = value;

    if (numberFields.includes(name)) {
      newValue = value === "" ? null : Number(value);
    } else if (booleanFields.includes(name)) {
      newValue = Boolean(value);
    }

    setTutorialArticle({
      ...article,
      [name]: newValue,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const updatedTutorialArticle = { ...article };
    updateTutorialArticle(updatedTutorialArticle)
      .then((updatedTutorialArticleResponse) => {
        setTutorialArticle(updatedTutorialArticleResponse);
        router.push(`/tutorials/articles`);
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

  const handlePublish = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.confirm("Are you sure you want to publish this article?")) {
      const updatedTutorialArticle = { ...article };
      publishTutorialArticle(updatedTutorialArticle.id)
        .then((updatedTutorialArticleResponse) => {
          setTutorialArticle(updatedTutorialArticleResponse);
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

  const onFileUploaded = (mediaId: number) => {
    updateTutorialArticleImage(articleId, mediaId)
      .then((updatedTutorialArticleResponse) => {
        setTutorialArticle(updatedTutorialArticleResponse);
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

  const onDeleteMedia = (mediaId: number) => {
    deleteMedia(mediaId)
      .then(() => {
        if (article && article.medias) {
          const updatedMedias = article.medias.filter(
            (media) => media.id !== mediaId
          );
          setTutorialArticle({ ...article, medias: updatedMedias });
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
  };

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">Edit Tutorial Article</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href={`/portfolio`}>Tutorial Articles</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Tutorial Article
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 col-xl-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <FileUpload onComplete={onFileUploaded} />
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="text-wrap">
                        <div className="">
                          <div className="tags">
                            {article &&
                              article.medias &&
                              article.medias.map((media, index) => (
                                <span
                                  key={index}
                                  className="tag file-square-attachments tag-outline"
                                >
                                  <div className="preview-popup">
                                    {media.type.startsWith("image") ? (
                                      <Image
                                        src={`${getConfig().apiUrl}/medias/${
                                          media.id
                                        }`}
                                        key={`${getConfig().apiUrl}/medias/${
                                          media.id
                                        }`}
                                        alt={media.filename}
                                        width={100}
                                        height={100}
                                      />
                                    ) : (
                                      <p>Keine Vorschau verfügbar</p>
                                    )}
                                  </div>
                                  <span>
                                    {media.type.startsWith("image") && (
                                      <i className="zmdi zmdi-image fs-18 px-1 text-primary"></i>
                                    )}
                                    {!media.type.startsWith("image") && (
                                      <i className="zmdi zmdi-file fs-18 px-1 text-primary"></i>
                                    )}
                                  </span>
                                  <Link
                                    href={media.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {media.filename}
                                  </Link>
                                  <Link
                                    className="mt-1 ms-2"
                                    href={""}
                                    onClick={() => onDeleteMedia(media.id)}
                                  >
                                    <i className="fe fe-x"></i>
                                  </Link>
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-xl-12">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="">
                          <input
                            type="hidden"
                            className="form-control"
                            id="id"
                            name="id"
                            placeholder=""
                            value={article.id}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label
                            htmlFor="position"
                            className="col-md-12 form-label"
                          >
                            Position
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="position"
                            name="position"
                            placeholder="0"
                            value={article.position}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="chapterId"
                            className="col-md-12 form-label"
                          >
                            Tutorial Chapter
                          </label>
                          <select
                            className="form-control"
                            id="chapterId"
                            name="chapterId"
                            value={article.chapterId || ""}
                            onChange={handleChange}
                          >
                            <option value="">
                              -- Please select an chapter --
                            </option>
                            {categories &&
                              categories.map((chapter, index) => (
                                <option key={index} value={chapter.id}>
                                  {chapter.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label
                            htmlFor="title"
                            className="col-md-12 form-label"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            placeholder=""
                            value={article.title}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="slug"
                            className="col-md-12 form-label"
                          >
                            Slug
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="slug"
                            name="slug"
                            placeholder=""
                            value={article.slug}
                            onChange={handleChange}
                            disabled
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="shortTitle"
                            className="col-md-12 form-label"
                          >
                            Short Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="shortTitle"
                            name="shortTitle"
                            placeholder=""
                            value={article.shortTitle}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="previewHostedVideoUrl"
                            className="col-md-12 form-label"
                          >
                            Preview Hosted Video Url (Youtube, Vimeo, etc.)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="previewHostedVideoUrl"
                            name="previewHostedVideoUrl"
                            placeholder=""
                            value={article.previewHostedVideoUrl || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="previewMediaId"
                            className="col-md-12 form-label"
                          >
                            Preview Media
                          </label>
                          <select
                            className="form-control"
                            id="previewMediaId"
                            name="previewMediaId"
                            value={article.previewMediaId || ""}
                            onChange={handleChange}
                          >
                            <option value="">
                              -- Please select an image --
                            </option>
                            {article &&
                              article.medias &&
                              article.medias.map((media, index) => (
                                <option key={index} value={media.id}>
                                  {media.filename}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="previewText"
                            className="col-md-12 form-label"
                          >
                            Preview Text
                          </label>
                          <textarea
                            className="form-control"
                            id="previewText"
                            name="previewText"
                            placeholder=""
                            rows={5}
                            value={article.previewText || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="tags"
                            className="col-md-12 form-label"
                          >
                            Tags
                          </label>
                          <textarea
                            className="form-control"
                            id="tags"
                            name="tags"
                            placeholder=""
                            value={article.tags || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="text"
                            className="col-md-12 form-label"
                          >
                            Text
                          </label>
                          <textarea
                            className="form-control"
                            id="text"
                            name="text"
                            placeholder=""
                            rows={30}
                            value={article.text}
                            onChange={handleChange}
                          />
                        </div>
                        {!article.isPublished && (
                          <button
                            type="button"
                            className={`btn btn-success ${articletyles.spacing}`}
                            onClick={handlePublish}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          className={`btn btn-primary ${articletyles.spacing}`}
                          onClick={handleSubmit}
                        >
                          Update
                        </button>
                        <Link
                          href={`/tutorials/articles`}
                          type="button"
                          className="btn btn-secondary"
                        >
                          Cancel
                        </Link>
                      </form>
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
