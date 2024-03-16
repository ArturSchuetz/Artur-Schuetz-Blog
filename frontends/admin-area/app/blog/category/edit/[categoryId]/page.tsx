"use client";

import categorystyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import FileUpload from "@/app/_components/_partials/FileUpload";
import {
  BlogCategory,
  getBlogCategory,
  updateBlogCategory,
  updateBlogCategoryImage,
} from "@/app/_services/blog-category.service";
import { deleteMedia } from "@/app/_services/media.service";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function EditBlogCategory({
  params,
}: {
  params: { categoryId: number };
}) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const categoryId = params.categoryId;
  const [category, setBlogCategory] = useState<BlogCategory>({
    id: 0,
    name: "",
    slug: "",
    color: "",
    titlePageImageId: null,
    medias: [],
  });

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case "s":
            event.preventDefault();
            const updatedBlogCategory = { ...category };
            updateBlogCategory(updatedBlogCategory)
              .then((updatedBlogCategoryResponse) => {
                setBlogCategory(updatedBlogCategoryResponse);
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
  }, [category, router]);

  useEffect(() => {
    getBlogCategory(categoryId)
      .then((fetchedBlogCategory) => {
        setBlogCategory(fetchedBlogCategory);
        console.log(fetchedBlogCategory.medias)
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
  }, [categoryId, router]);

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

    setBlogCategory({
      ...category,
      [name]: newValue,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedBlogCategory = { ...category };
    updateBlogCategory(updatedBlogCategory)
      .then((updatedBlogCategoryResponse) => {
        setBlogCategory(updatedBlogCategoryResponse);
        router.push(`/blog/category`);
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
    updateBlogCategoryImage(categoryId, mediaId)
      .then((updatedBlogCategoryResponse) => {
        setBlogCategory(updatedBlogCategoryResponse);
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
        if (category && category.medias) {
          const updatedMedias = category.medias.filter(
            (media) => media.id !== mediaId
          );
          setBlogCategory({ ...category, medias: updatedMedias });
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
                <h1 className="page-title">Edit BlogCategory</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href={`/category`}>Blog Categories</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit BlogCategory
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
                            {category &&
                              category.medias &&
                              category.medias.map((media, index) => (
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
                            value={category.id}
                            onChange={handleChange}
                          />

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
                              value={category.name}
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
                              value={category.slug}
                              onChange={handleChange}
                              disabled
                            />
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="color"
                              className="col-md-12 form-label"
                            >
                              Color
                            </label>
                            <select
                              className="form-control"
                              id="color"
                              name="color"
                              value={category.color || ""}
                              onChange={handleChange}
                            >
                              <option value="">
                                -- Please select an image --
                              </option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="cyan">Cyan</option>
                              <option value="lime">Lime</option>
                              <option value="indigo">Indigo</option>
                              <option value="amber">Amber</option>
                              <option value="teal">Teal</option>
                              <option value="deep-orange">Deep Orange</option>
                              <option value="pink">Pink</option>
                              <option value="deep-purple">Deep Purple</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="titlePageImageId"
                              className="col-md-12 form-label"
                            >
                              Image
                            </label>
                            <select
                              className="form-control"
                              id="titlePageImageId"
                              name="titlePageImageId"
                              value={category.titlePageImageId || ""}
                              onChange={handleChange}
                            >
                              <option value="">
                                -- Please select an image --
                              </option>
                              {category &&
                                category.medias &&
                                category.medias.map((media, index) => (
                                  <option key={index} value={media.id}>
                                    {media.filename}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className={`btn btn-primary ${categorystyles.spacing}`}
                        >
                          Update
                        </button>
                        <Link
                          href={`/blog/category`}
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
