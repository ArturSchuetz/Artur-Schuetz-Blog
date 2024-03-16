"use client";
import chaptertyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import FileUpload from "@/app/_components/_partials/FileUpload";
import {
  TutorialChapter,
  getTutorialChapter,
  updateTutorialChapter,
  updateTutorialChapterImage,
} from "@/app/_services/tutorial-chapter.service";

import {
  TutorialTopic,
  getTutorialTopics,
} from "@/app/_services/tutorial-topic.service";

import { deleteMedia } from "@/app/_services/media.service";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function EditTutorialChapter({
  params,
}: {
  params: { chapterId: number };
}) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const chapterId = params.chapterId;
  const [chapter, setTutorialChapter] = useState<TutorialChapter>({
    id: 0,
    position: 0,
    name: "",
    slug: "",
    imageId: null,
    topic: null,
    topicId: null,
    articles: [],
    medias: [],
  });
  const [topics, setTutorialTopics] = useState<TutorialTopic[]>([]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case "s":
            event.preventDefault();
            const updatedTutorialChapter = { ...chapter };
            updateTutorialChapter(updatedTutorialChapter)
              .then((updatedTutorialChapterResponse) => {
                setTutorialChapter(updatedTutorialChapterResponse);
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
  }, [chapter, router]);

  useEffect(() => {
    getTutorialTopics()
      .then((fetchedTutorialTopics) => {
        setTutorialTopics(fetchedTutorialTopics);
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
    getTutorialChapter(chapterId)
      .then((fetchedTutorialChapter) => {
        setTutorialChapter(fetchedTutorialChapter);
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
  }, [chapterId, router]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const numberFields = ["imageMediaId"];

    let newValue: string | number | boolean | null = value;

    if (numberFields.includes(name)) {
      newValue = value === "" ? null : Number(value);
    }

    setTutorialChapter({
      ...chapter,
      [name]: newValue,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTutorialChapter = { ...chapter };
    updateTutorialChapter(updatedTutorialChapter)
      .then((updatedTutorialChapterResponse) => {
        setTutorialChapter(updatedTutorialChapterResponse);
        router.push(`/tutorials/chapter`);
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

  const onFileUploaded = (mediaId: number) => {
    updateTutorialChapterImage(chapterId, mediaId)
      .then((updatedTutorialChapterResponse) => {
        setTutorialChapter(updatedTutorialChapterResponse);
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
        if (chapter && chapter.medias) {
          const updatedMedias = chapter.medias.filter(
            (media) => media.id !== mediaId
          );
          setTutorialChapter({ ...chapter, medias: updatedMedias });
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
                <h1 className="page-title">Edit Tutorial Chapter</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href={`/tutorials/chapter`}>Tutorial Chapter</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Tutorial Chapter
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
                            {chapter &&
                              chapter.medias &&
                              chapter.medias.map((media, index) => (
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
                      <form onSubmit={handleSubmit}>
                        <div className="">
                          <input
                            type="hidden"
                            className="form-control"
                            id="id"
                            name="id"
                            placeholder=""
                            value={chapter.id}
                            onChange={handleChange}
                          />

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
                              value={chapter.position}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="topicId"
                              className="col-md-12 form-label"
                            >
                              Tutorial Topic
                            </label>
                            <select
                              className="form-control"
                              id="topicId"
                              name="topicId"
                              value={chapter.topicId || ""}
                              onChange={handleChange}
                            >
                              <option value="">
                                -- Please select an topic --
                              </option>
                              {topics &&
                                topics.map((topic, index) => (
                                  <option key={index} value={topic.id}>
                                    {topic.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="name"
                              className="col-md-12 form-label"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              placeholder=""
                              value={chapter.name}
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
                              value={chapter.slug}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                          
                          <div className="form-group">
                            <label
                              htmlFor="imageId"
                              className="col-md-12 form-label"
                            >
                              Image
                            </label>
                            <select
                              className="form-control"
                              id="imageId"
                              name="imageId"
                              value={chapter.imageId || ""}
                              onChange={handleChange}
                            >
                              <option value="">
                                -- Please select an image --
                              </option>
                              {chapter &&
                                chapter.medias &&
                                chapter.medias.map((media, index) => (
                                  <option key={index} value={media.id}>
                                    {media.filename}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className={`btn btn-primary ${chaptertyles.spacing}`}
                        >
                          Update
                        </button>
                        <Link
                          href={`/tutorials/chapter`}
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
