"use client";
import userstyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FileUpload from "@/app/_components/_partials/FileUpload";

import {
  getUserById,
  updateUser,
  updateUserImage,
  User,
} from "@/app/_services/user.service";
import { deleteMedia } from "@/app/_services/media.service";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function EditUser({ params }: { params: { userId: number } }) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const userId = params.userId;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case "s":
            event.preventDefault();
            const updatedUser = { ...user };
            updateUser(updatedUser)
              .then((updatedUserResponse) => {
                setUser(updatedUserResponse);
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
  }, [user, router]);

  useEffect(() => {
    getUserById(userId)
      .then((fetchedUser) => {
        setUser(fetchedUser);
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
  }, [userId, router]);

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

    setUser({
      ...user,
      [name]: newValue,
    } as User);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUser = { ...user };
    updateUser(updatedUser)
      .then((updatedUserResponse) => {
        setUser(updatedUserResponse);
        router.push(`/user-management`);
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
    updateUserImage(userId, mediaId)
      .then((updatedUserResponse) => {
        setUser(updatedUserResponse);
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
        if (user && user.medias) {
          const updatedMedias = user.medias.filter(
            (media) => media.id !== mediaId
          );
          setUser({ ...user, medias: updatedMedias });
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
                <h1 className="page-title">Edit User</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href={`/user-management`}>Users</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit User
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
                            {user &&
                              user.medias &&
                              user.medias.map((media, index) => (
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
              {user && (
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
                              value={user?.id}
                              onChange={handleChange}
                            />
                            <div className="form-group">
                              <label
                                htmlFor="avatarImageId"
                                className="col-md-12 form-label"
                              >
                                Avatar Image
                              </label>
                              <select
                                className="form-control"
                                id="avatarImageId"
                                name="avatarImageId"
                                value={user.avatarImageId || ""}
                                onChange={handleChange}
                              >
                                <option value="">
                                  -- Please select an image --
                                </option>
                                {user &&
                                  user.medias &&
                                  user.medias.map((media, index) => (
                                    <option key={index} value={media.id}>
                                      {media.filename}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="email"
                                className="col-md-12 form-label"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder=""
                                value={user.email}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="username"
                                className="col-md-12 form-label"
                              >
                                Username
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                placeholder=""
                                value={user.username}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="password"
                                className="col-md-12 form-label"
                              >
                                Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder=""
                                value={user.password}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="firstName"
                                className="col-md-12 form-label"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                placeholder=""
                                value={user.firstName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="lastName"
                                className="col-md-12 form-label"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                placeholder=""
                                value={user.lastName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="salt"
                                className="col-md-12 form-label"
                              >
                                Salt
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="salt"
                                name="salt"
                                placeholder=""
                                value={user.salt}
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="resetPasswordToken"
                                className="col-md-12 form-label"
                              >
                                Reset Password Token
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="resetPasswordToken"
                                name="resetPasswordToken"
                                placeholder=""
                                value={user.resetPasswordToken}
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="resetPasswordExpires"
                                className="col-md-12 form-label"
                              >
                                Reset Password Expires
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="resetPasswordExpires"
                                name="resetPasswordExpires"
                                placeholder=""
                                value={
                                  user.resetPasswordExpires != null &&
                                  user.resetPasswordExpires !== undefined
                                    ? user.resetPasswordExpires.toString()
                                    : ""
                                }
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="verificationToken"
                                className="col-md-12 form-label"
                              >
                                Verification Token
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="verificationToken"
                                name="verificationToken"
                                placeholder=""
                                value={user.verificationToken}
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <label className="custom-switch form-switch mb-0">
                                <input
                                  type="checkbox"
                                  id="isVerified"
                                  name="custom-switch-radio"
                                  className="custom-switch-input"
                                  checked={user.isVerified}
                                  onClick={() => {
                                    user.isVerified = !user.isVerified;
                                  }}
                                  onChange={handleChange}
                                />
                                <span className="custom-switch-indicator custom-switch-indicator-md"></span>
                                <span className="custom-switch-description">
                                  Is Verified
                                </span>
                              </label>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="avatarImageId"
                                className="col-md-12 form-label"
                              >
                                Role
                              </label>
                              <select
                                className="form-control"
                                id="role"
                                name="role"
                                value={user.role || ""}
                                onChange={handleChange}
                              >
                                <option value="">
                                  -- Please select an Role --
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="custom-switch form-switch mb-0">
                                <input
                                  id="isActive"
                                  type="checkbox"
                                  name="custom-switch-radio"
                                  className="custom-switch-input"
                                  checked={user.isActive}
                                  onClick={() => {
                                    user.isActive = !user.isActive;
                                  }}
                                  onChange={handleChange}
                                />
                                <span className="custom-switch-indicator custom-switch-indicator-md"></span>
                                <span className="custom-switch-description">
                                  Is Active
                                </span>
                              </label>
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="lastLogin"
                                className="col-md-12 form-label"
                              >
                                Last Login
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="lastLogin"
                                name="lastLogin"
                                placeholder=""
                                value={
                                  user.lastLogin != null &&
                                  user.lastLogin !== undefined
                                    ? user.lastLogin.toString()
                                    : ""
                                }
                                onChange={handleChange}
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <label
                                htmlFor="metadata"
                                className="col-md-12 form-label"
                              >
                                Metadata
                              </label>
                              <textarea
                                className="form-control"
                                id="metadata"
                                name="metadata"
                                placeholder=""
                                onChange={handleChange}
                              >
                                {user.metadata}
                              </textarea>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className={`btn btn-primary ${userstyles.spacing}`}
                          >
                            Update
                          </button>
                          <Link
                            href={`/user-management`}
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
