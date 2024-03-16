"use client";
import chaptertyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  TutorialChapter,
  createTutorialChapter,
  deleteTutorialChapter,
  getTutorialChapters,
} from "../../_services/tutorial-chapter.service";
import UnauthorizedException from "../../_common/Exceptions/unauthorized-exception";
import { useAuth } from "../../_context/AuthContext";

export default function TutorialChapterList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [chapter, setTutorialChapters] = useState<TutorialChapter[]>([]);

  useEffect(() => {
    getTutorialChapters()
      .then((chapter) => {
        if (chapter) setTutorialChapters(chapter);
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

  const handleCreateTutorialChapter = () => {
    const newTutorialChapter: TutorialChapter = {
      id: 0,
      position: 0,
      name: "",
      slug: "",
      imageId: null,
      topic: null,
      topicId: null,
      articles: [],
      medias: [],
    };

    createTutorialChapter(newTutorialChapter)
      .then((createdTutorialChapter) => {
        setTutorialChapters((prevTutorialChapter) => [...prevTutorialChapter, createdTutorialChapter]);
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

  function handleDeleteRequest(chapterId: number): void {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      deleteTutorialChapter(chapterId)
        .then((success) => {
          if (success) {
            setTutorialChapters((prevTutorialChapters) =>
              prevTutorialChapters.filter((chapter) => chapter.id !== chapterId)
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
  }

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">Tutorial Chapters</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tutorial Chapters
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
                        onClick={handleCreateTutorialChapter}
                      >
                        {" "}
                        Add New Tutorial Chapter
                      </button>

                      <div className="table-responsive">
                        <table className="table table-bordered border text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th style={{width: 0}}>ID</th>
                              <th style={{width: 0}}>Pos</th>
                              <th>Name</th>
                              <th>Topic</th>
                              <th
                                className={`bstable-actions ${chaptertyles.buttonColumn}`}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {chapter &&
                              chapter.map((chapter) => (
                                <tr key={chapter.id}>
                                  <td>{chapter.id}</td>
                                  <td>{chapter.position}</td>
                                  <td>{chapter.name}</td>
                                  <td>{chapter.topic?.name}</td>
                                  <td>
                                    <Link
                                      href={`/tutorials/chapter/edit/${chapter.id}`}
                                      className={`btn btn-primary btn-sm ${chaptertyles.editButtonMargin} ${chaptertyles.smallButton}`}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                    <button
                                      className={`btn btn-danger btn-sm ${chaptertyles.smallButton}`}
                                      onClick={() =>
                                        handleDeleteRequest(chapter.id)
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
