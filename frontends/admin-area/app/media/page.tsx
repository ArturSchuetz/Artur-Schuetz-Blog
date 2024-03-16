"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  getMedias,
  formatBytes,
  mime_type_to_category,
  Media,
} from "@/app/_services/media.service";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

interface MediaCategory {
  name: string;
  svg: string; // Pfad zur SVG oder SVG-String
  size: number; // Gesamtgröße der Dateien in dieser Kategorie
  fileCount: number; // Anzahl der Dateien in dieser Kategorie
  medias: Media[]; // Die Medien in dieser Kategorie
}

interface FileTypeItem {
  label: string;
  icon: string;
  color: string;
  size: number;
  progress: number;
}

export default function MediasList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [medias, setMedias] = useState<Media[]>([]);
  const [categorizedMedias, setCategorizedMedias] = useState<MediaCategory[]>(
    []
  );
  const [fileTypeItems, setFileTypeItems] = useState<FileTypeItem[]>([
    {
      label: "Images",
      icon: "fe-image",
      color: "green",
      size: 0,
      progress: 0,
    },
    {
      label: "Videos",
      icon: "fe-video",
      color: "secondary",
      size: 0,
      progress: 0,
    },
    {
      label: "Docs",
      icon: "fe-file-text",
      color: "primary",
      size: 0,
      progress: 0,
    },
    {
      label: "Music",
      icon: "fe-music",
      color: "warning",
      size: 0,
      progress: 0,
    },
    {
      label: "Downloads",
      icon: "fe-download",
      color: "info",
      size: 0,
      progress: 0,
    },
    {
      label: "More",
      icon: "fe-grid",
      color: "danger",
      size: 0,
      progress: 0,
    },
  ] as FileTypeItem[]);
  const [usedStorage, setUsedStorage] = useState<number>(0);
  const [totalStorage, setTotalStorage] = useState<number>(100 * 1024 * 1024);
  const [usedStoragePercentage, setUsedStoragePercentage] = useState<number>(0);

  useEffect(() => {
    getMedias()
      .then((medias) => {
        if (medias) setMedias(medias);
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
    if (usedStorage && totalStorage > 0) {
      setUsedStoragePercentage(usedStorage / totalStorage);
    } else {
      setUsedStoragePercentage(0);
    }
  }, [usedStorage, totalStorage]);

  useEffect(() => {
    const tempCategorizedMedias: { [key: string]: MediaCategory } = {};
    let tempFileTypeItems = [...fileTypeItems];

    let tempUsedStorage = 0;
    tempFileTypeItems = tempFileTypeItems.map((item) => ({ ...item, size: 0 }));

    medias.forEach((media) => {
      const category = mime_type_to_category(media.type);
      if (!tempCategorizedMedias[category]) {
        tempCategorizedMedias[category] = {
          name: category,
          svg: "",
          size: 0,
          fileCount: 0,
          medias: [],
        };
      }
      tempCategorizedMedias[category].medias.push(media);
      tempCategorizedMedias[category].fileCount += 1;

      const size =
        typeof media.size === "string" ? parseFloat(media.size) : media.size;

      if (typeof size === "number") {
        tempCategorizedMedias[category].size += size;

        const fileTypeIndex = tempFileTypeItems.findIndex(
          (item) => item.label === category
        );
        if (fileTypeIndex !== -1) {
          tempFileTypeItems[fileTypeIndex].size += size;
          tempUsedStorage += size;
        }
      } else {
        console.warn(
          `Invalid media.size detected: ${
            media.size
          }, type: ${typeof media.size}`
        );
      }
    });

    setCategorizedMedias(Object.values(tempCategorizedMedias));
    setFileTypeItems(tempFileTypeItems);
    setUsedStorage(tempUsedStorage);
  }, [medias]);

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">File Manager</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      File Manager
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row row-sm">
                <div className="col-lg-5 col-xl-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <button
                        className="btn btn-primary btn-block"
                        data-bs-target="#createfile"
                        data-bs-toggle="modal"
                      >
                        <i className="fe fe-plus me-1"></i> Upload New File
                      </button>
                    </div>
                    <div className="card-body pt-4">
                      <div className="list-group list-group-transparent mb-0 file-manager">
                        {fileTypeItems.map((item, index) => (
                          <div key={index}>
                            <div className="d-flex">
                              <div>
                                <Link
                                  href=""
                                  className="list-group-item d-flex align-items-center px-0"
                                >
                                  <i
                                    className={`fe ${item.icon} fs-18 me-2 text-${item.color} p-2`}
                                  ></i>{" "}
                                  {item.label}
                                </Link>
                              </div>
                              <div className="text-end ms-auto mt-3">
                                <span className="fs-11 text-dark">
                                  {formatBytes(item.size)}
                                </span>
                              </div>
                            </div>
                            <div className="progress progress-xs mb-3 ms-2">
                              <div
                                className={`progress-bar bg-${item.color}`}
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex">
                        <h3 className="ms-3 mt-5 fw-semibold">
                          {medias?.length} Files
                        </h3>
                        <div className="ms-5 ms-auto"></div>
                      </div>
                      <div className="progress progress-xs mb-3">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: usedStoragePercentage * 100 + "%" }}
                        ></div>
                      </div>
                      <div className="">
                        <div className="d-flex">
                          <div className="d-flex">
                            <div>
                              <h6 className="mt-2">
                                <i className="fe fe-circle text-success fs-12"></i>{" "}
                                Total Storage
                              </h6>
                              <span className="text-muted">
                                {formatBytes(totalStorage)}
                              </span>
                            </div>
                          </div>
                          <div className="ms-auto my-auto">
                            <h6 className="mt-2">
                              <i className="fe fe-circle text-danger fs-12"></i>{" "}
                              Used
                            </h6>
                            <span className="text-muted">
                              {formatBytes(usedStorage)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 col-xl-9">
                  <div className="row row-sm">
                    <div className="text-dark mb-2 ms-1 fs-20 fw-semibold">
                      All Folders
                    </div>
                    {categorizedMedias.map((category, index) => (
                      <div className="col-xl-3 col-md-6 col-sm-6" key={index}>
                        <div className="card pos-relative">
                          <Link href="/" className="open-file"></Link>
                          <div className="card-body px-4 pt-4 pb-2">
                            <div className="d-flex">
                              <span
                                className={`bg-${category.name}-transparent border border-${category.name} brround`}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: category.svg,
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                          <div className="card-footer border-top-0">
                            <div className="d-flex">
                              <div>
                                <h5 className={`text-${category.name}`}>
                                  {category.name}
                                </h5>
                                <p className="text-muted fs-13 mb-0">
                                  {category.fileCount} Files
                                </p>
                              </div>
                              <div className="ms-auto mt-4">
                                <h6 className="">
                                  {formatBytes(category.size)}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
