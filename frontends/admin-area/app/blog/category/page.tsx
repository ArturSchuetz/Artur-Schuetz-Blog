"use client";
import categorystyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  BlogCategory,
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategories,
} from "../../_services/blog-category.service";
import UnauthorizedException from "../../_common/Exceptions/unauthorized-exception";
import { useAuth } from "../../_context/AuthContext";

export default function BlogCategoryList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [categories, setBlogCategories] = useState<BlogCategory[]>([]);

  useEffect(() => {
    getBlogCategories()
      .then((categories) => {
        if (categories) setBlogCategories(categories);
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

  const handleCreateBlogCategory = () => {
    const newBlogCategory: BlogCategory = {
      id: 0,
      name: "",
      slug: "",
      color: "",
      titlePageImageId: null,
      medias: [],
    };

    createBlogCategory(newBlogCategory)
      .then((createdBlogCategory) => {
        setBlogCategories((prevBlogCategory) => [...prevBlogCategory, createdBlogCategory]);
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

  function handleDeleteRequest(categoryId: number): void {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteBlogCategory(categoryId)
        .then((success) => {
          if (success) {
            setBlogCategories((prevBlogCategories) =>
              prevBlogCategories.filter((category) => category.id !== categoryId)
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
                <h1 className="page-title">Blog BlogCategories</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Blog BlogCategories
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
                        onClick={handleCreateBlogCategory}
                      >
                        {" "}
                        Add New Blog Category
                      </button>

                      <div className="table-responsive">
                        <table className="table table-bordered border text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Color</th>
                              <th
                                className={`bstable-actions ${categorystyles.buttonColumn}`}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories &&
                              categories.map((category) => (
                                <tr key={category.id}>
                                  <td>{category.id}</td>
                                  <td>{category.name}</td>
                                  <td>{category.color}</td>
                                  <td>
                                    <Link
                                      href={`/blog/category/edit/${category.id}`}
                                      className={`btn btn-primary btn-sm ${categorystyles.editButtonMargin} ${categorystyles.smallButton}`}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                    <button
                                      className={`btn btn-danger btn-sm ${categorystyles.smallButton}`}
                                      onClick={() =>
                                        handleDeleteRequest(category.id)
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
