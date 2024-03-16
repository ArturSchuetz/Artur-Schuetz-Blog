"use client";
import userstyles from "./style.module.css";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  getUsersPaginated,
  deleteUser,
  User,
} from "@/app/_services/user.service";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function UsersList() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const page = 1;
  const pageSize = 10;

  useEffect(() => {
    getUsersPaginated(page, pageSize)
      .then((paginatedUsers) => {
        setUsers(paginatedUsers.data);
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

  const handleDeleteRequest = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
        .then((success) => {
          if (success) {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
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
                <h1 className="page-title">Users</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Users
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row row-sm">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-bordered border text-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Username</th>
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th className={userstyles.buttonColumn}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {users?.map((user) => (
                              <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>
                                  <Link
                                    href={`/user-management/edit/${user.id}`}
                                    className={`btn btn-primary btn-sm ${userstyles.editButtonMargin} ${userstyles.smallButton}`}
                                  >
                                    <i className="fa fa-edit"></i>
                                  </Link>
                                  <button
                                    className={`btn btn-danger btn-sm ${userstyles.smallButton}`}
                                    onClick={() => handleDeleteRequest(user.id)}
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
