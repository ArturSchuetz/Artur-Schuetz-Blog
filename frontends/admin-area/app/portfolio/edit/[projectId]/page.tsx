"use client";
import portfoliostyles from "./style.module.css";

import "@/public/iconfonts/materialdesignicons/materialdesignicons.css";
import "react-color-palette/css";

import { ColorPicker, ColorService, useColor } from "react-color-palette";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import FileUpload from "@/app/_components/_partials/FileUpload";

import {
  getProjectById,
  updateProject,
  updateProjectImage,
  Project,
} from "@/app/_services/project.service";
import { deleteMedia } from "@/app/_services/media.service";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function EditPortfoioProject({
  params,
}: {
  params: { projectId: number };
}) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project>({
    id: 0,
    title: "",
    category: "",
    text: "",
    imageMediaId: null,
    background: null,
    link: "",
    medias: [],
    updatedAt: null
  });
  const [color, setColor] = useColor("#ffffff");

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case "s":
            event.preventDefault();
            const updatedProject = { ...project, background: color.hex };
            updateProject(updatedProject)
              .then((updatedProjectResponse) => {
                setProject(updatedProjectResponse);
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
  }, [color.hex, project, router]);

  useEffect(() => {
    getProjectById(projectId)
      .then((fetchedProject) => {
        setProject(fetchedProject);
        setColor(
          ColorService.convert("hex", fetchedProject.background || "#ffffff")
        );
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
  }, [projectId, router, setColor]);

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

    setProject({
      ...project,
      [name]: newValue,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProject = { ...project, background: color.hex };
    updateProject(updatedProject)
      .then((updatedProjectResponse) => {
        setProject(updatedProjectResponse);
        router.push(`/portfolio`);
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
    updateProjectImage(projectId, mediaId)
      .then((updatedProjectResponse) => {
        setProject(updatedProjectResponse);
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
        if (project && project.medias) {
          const updatedMedias = project.medias.filter(
            (media) => media.id !== mediaId
          );
          setProject({ ...project, medias: updatedMedias });
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
                <h1 className="page-title">Edit Portfolio Project</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href={`/portfolio`}>Portfolio Projects</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Portfolio Project
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
                            {project &&
                              project.medias &&
                              project.medias.map((media, index) => (
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
                            value={project.id}
                            onChange={handleChange}
                          />

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
                              value={project.title}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="category"
                              className="col-md-12 form-label"
                            >
                              Category
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="category"
                              name="category"
                              placeholder=""
                              value={project.category}
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
                              value={project.text}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="imageMediaId"
                              className="col-md-12 form-label"
                            >
                              Image
                            </label>
                            <select
                              className="form-control"
                              id="imageMediaId"
                              name="imageMediaId"
                              value={project.imageMediaId || ""}
                              onChange={handleChange}
                            >
                              <option value="">
                                -- Please select an image --
                              </option>
                              {project &&
                                project.medias &&
                                project.medias.map((media, index) => (
                                  <option key={index} value={media.id}>
                                    {media.filename}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="background"
                              className="col-md-12 form-label"
                            >
                              Background
                            </label>
                            <ColorPicker color={color} onChange={setColor} />
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="link"
                              className="col-md-12 form-label"
                            >
                              Link
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="link"
                              name="link"
                              placeholder=""
                              value={project.link}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className={`btn btn-primary ${portfoliostyles.spacing}`}
                        >
                          Update
                        </button>
                        <Link
                          href={`/portfolio`}
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
