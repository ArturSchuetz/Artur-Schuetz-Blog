"use client";
import portfoliostyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  getProjectsPaginated,
  createProject,
  deleteProject,
  Project,
} from "@/app/_services/project.service";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function PortfolioProjectsList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const page = 1;
  const pageSize = 9999;

  useEffect(() => {
    getProjectsPaginated(page, pageSize)
      .then((paginatedProjects) => {
        setProjects(paginatedProjects.data);
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

  const handleCreateProject = () => {
    const newProject: Project = {
      id: 0,
      title: "",
      category: "",
      text: "",
      imageMediaId: null,
      background: null,
      link: "",
      medias: null,
      updatedAt: null,
    };
    createProject(newProject)
      .then((createdProject) => {
        setProjects((prevProjects) => [...prevProjects, createdProject]);
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

  const handleDeleteRequest = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId)
        .then((success) => {
          if (success) {
            setProjects((prevProjects) =>
              prevProjects.filter((project) => project.id !== projectId)
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
                <h1 className="page-title">Portfolio Projects</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Portfolio Projects
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
                        onClick={handleCreateProject}
                      >
                        {" "}
                        Add New Project
                      </button>
                      <div className="table-responsive">
                        <table className="table table-bordered border text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Link</th>
                              <th style={{ width: "10px" }}>BG</th>
                              <th className={portfoliostyles.buttonColumn}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects?.map((project) => (
                              <tr key={project.id}>
                                <td>{project.title}</td>
                                <td>{project.category}</td>
                                <td>
                                  <Link
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {project.link}
                                  </Link>
                                </td>
                                <td>
                                  <div
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor: project.background
                                        ? project.background
                                        : undefined,
                                    }}
                                  />
                                </td>
                                <td>
                                  <Link
                                    href={`/portfolio/edit/${project.id}`}
                                    className={`btn btn-primary btn-sm ${portfoliostyles.editButtonMargin} ${portfoliostyles.smallButton}`}
                                  >
                                    <i className="fa fa-edit"></i>
                                  </Link>
                                  <button
                                    className={`btn btn-danger btn-sm ${portfoliostyles.smallButton}`}
                                    onClick={() =>
                                      handleDeleteRequest(project.id)
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
