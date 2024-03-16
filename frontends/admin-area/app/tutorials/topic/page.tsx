"use client";
import topicstyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  TutorialTopic,
  createTutorialTopic,
  deleteTutorialTopic,
  getTutorialTopics,
} from "../../_services/tutorial-topic.service";
import UnauthorizedException from "../../_common/Exceptions/unauthorized-exception";
import { useAuth } from "../../_context/AuthContext";

export default function TutorialTopicList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [topics, setTutorialTopics] = useState<TutorialTopic[]>([]);

  useEffect(() => {
    getTutorialTopics()
      .then((topics) => {
        if (topics) setTutorialTopics(topics);
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

  const handleCreateTutorialTopic = () => {
    const newTutorialTopic: TutorialTopic = {
      id: 0,
      position: 0,
      name: "",
      slug: "",
      description: "",
      color: "",
      imageId: null,
      category: null,
      categoryId: null,
      chapters: null,
      medias: [],
    };

    createTutorialTopic(newTutorialTopic)
      .then((createdTutorialTopic) => {
        setTutorialTopics((prevTutorialTopic) => [...prevTutorialTopic, createdTutorialTopic]);
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

  function handleDeleteRequest(topicId: number): void {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      deleteTutorialTopic(topicId)
        .then((success) => {
          if (success) {
            setTutorialTopics((prevTutorialTopics) =>
              prevTutorialTopics.filter((topic) => topic.id !== topicId)
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
                <h1 className="page-title">Tutorial Topics</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tutorial Topics
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
                        onClick={handleCreateTutorialTopic}
                      >
                        {" "}
                        Add New Tutorial Topic
                      </button>

                      <div className="table-responsive">
                        <table className="table table-bordered border text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th style={{width: 0}}>ID</th>
                              <th style={{width: 0}}>Pos</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Color</th>
                              <th
                                className={`bstable-actions ${topicstyles.buttonColumn}`}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {topics &&
                              topics.map((topic) => (
                                <tr key={topic.id}>
                                  <td>{topic.id}</td>
                                  <td>{topic.position}</td>
                                  <td>{topic.name}</td>
                                  <td>{topic.category?.name}</td>
                                  <td>{topic.color}</td>
                                  <td>
                                    <Link
                                      href={`/tutorials/topic/edit/${topic.id}`}
                                      className={`btn btn-primary btn-sm ${topicstyles.editButtonMargin} ${topicstyles.smallButton}`}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                    <button
                                      className={`btn btn-danger btn-sm ${topicstyles.smallButton}`}
                                      onClick={() =>
                                        handleDeleteRequest(topic.id)
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
