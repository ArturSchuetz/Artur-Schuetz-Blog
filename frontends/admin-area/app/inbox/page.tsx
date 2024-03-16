"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import {
  getMessagesPaginated,
  markMessageAsRead,
  deleteMessage,
  Message,
} from "@/app/_services/message.service";
import EmailNavigation from "../_components/_partials/EmailNavigation";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function Inbox() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [currentFolder, setCurrentFolder] = useState("Inbox");
  const [filters, setFilters] = useState({ read: false, starred: false });
  const pageSize = 50;

  const refreshMessages = useCallback(() => {
    getMessagesPaginated(currentPage, pageSize, currentFolder, filters)
      .then((data) => {
        setMessages(data.data);
        setTotalMessages(data.totalCount);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
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
  }, [currentPage, currentFolder, filters, router]);

  useEffect(() => {
    refreshMessages();
  }, [currentPage, currentFolder, filters, refreshMessages]);

  const markAsRead = (messageId: number) => {
    markMessageAsRead(messageId)
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
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
  };

  const deleteMessageHandler = (messageId: number) => {
    deleteMessage(messageId)
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
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
  };

  const toggleMessageSelection = (messageId: number) => {
    setSelectedMessages((prevSelected) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };

  const markSelectedAsRead = () => {
    Promise.all(selectedMessages.map((id) => markAsRead(id)))
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            selectedMessages.includes(msg.id) ? { ...msg, isRead: true } : msg
          )
        );
        setSelectedMessages([]); // Clear the selection
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

  const markSelectedAsSpam = () => {
    // Implement your logic to mark messages as spam
  };

  const deleteSelected = () => {
    Promise.all(selectedMessages.map((id) => deleteMessage(id)))
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => !selectedMessages.includes(msg.id))
        );
        setSelectedMessages([]); // Clear the selection
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

  const formatDate = (createdAt: Date) => {
    return new Date(createdAt).toLocaleString("de-DE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">Message Inbox</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Message Inbox
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row">
                <EmailNavigation />
                <div className="col-xl-9">
                  <div className="card">
                    <div className="card-body p-6">
                      <div className="inbox-body">
                        <div className="mail-option">
                          <div className="chk-all">
                            <div className="btn-group">
                              <a
                                data-bs-toggle="dropdown"
                                href="javascript:void(0)"
                                className="btn mini all"
                                aria-expanded="false"
                              >
                                All
                                <i className="fa fa-angle-down "></i>
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <a href="javascript:void(0)"> None</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)"> Read</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)"> Unread</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="btn-group">
                            <a
                              href="javascript:void(0)"
                              className="btn mini tooltips"
                              onClick={refreshMessages}
                            >
                              <i className=" fa fa-refresh"></i>
                            </a>
                          </div>
                          <div className="btn-group hidden-phone">
                            <a
                              data-bs-toggle="dropdown"
                              href="javascript:void(0)"
                              className="btn mini blue"
                              aria-expanded="false"
                            >
                              More
                              <i className="fa fa-angle-down "></i>
                            </a>
                            <ul className="dropdown-menu">
                              <li>
                                <a
                                  href="javascript:void(0)"
                                  onClick={markSelectedAsRead}
                                >
                                  <i className="fa fa-pencil me-2"></i> Mark as
                                  Read
                                </a>
                              </li>
                              <li>
                                <a
                                  href="javascript:void(0)"
                                  onClick={markSelectedAsSpam}
                                >
                                  <i className="fa fa-ban me-2"></i> Spam
                                </a>
                              </li>
                              <li className="divider"></li>
                              <li>
                                <a
                                  href="javascript:void(0)"
                                  onClick={deleteSelected}
                                >
                                  <i className="fa fa-trash-o me-2"></i> Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                          <ul className="unstyled inbox-pagination">
                            <li>
                              <span className="fs-13">1-50 of 234</span>
                            </li>

                            <li>
                              <a className="np-btn" href="javascript:void(0)">
                                <i className="fa fa-angle-right pagination-right"></i>
                              </a>
                            </li>
                          </ul>
                        </div>

                        <div className="table-responsive">
                          <table className="table table-inbox table-hover text-nowrap mb-0">
                            <tbody>
                              {messages?.map(
                                (
                                  { id, name, email, createdAt, read },
                                  index
                                ) => {
                                  const rowStyle = read
                                    ? "fw-semibold"
                                    : "fw-bold";
                                  const formattedDate = formatDate(createdAt);
                                  return (
                                    <tr
                                      key={index}
                                      className={read ? "read" : "unread"}
                                    >
                                      <td className="inbox-small-cells">
                                        <label className="custom-control custom-checkbox mb-0 ms-3">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            checked={selectedMessages.includes(
                                              id
                                            )}
                                            onChange={() =>
                                              toggleMessageSelection(id)
                                            }
                                          />
                                          <span className="custom-control-label"></span>
                                        </label>
                                      </td>
                                      {["name", "email"].map((field, idx) => (
                                        <td
                                          key={idx}
                                          className={`view-message dont-show ${rowStyle} clickable-row`}
                                        >
                                          <Link
                                            href={`/message/${id}`}
                                            onClick={() => markAsRead(id)}
                                          >
                                            {field === "name" ? name : email}
                                          </Link>
                                        </td>
                                      ))}
                                      <td
                                        className={`view-message ${rowStyle} clickable-row`}
                                      >
                                        <Link
                                          href={`/message/${id}`}
                                          onClick={() => markAsRead(id)}
                                        >
                                          {formattedDate}
                                        </Link>
                                      </td>
                                      <td className="view-message text-end clickable-row">
                                        <button
                                          className="btn btn-sm btn-icon btn-secondary me-2"
                                          onClick={() =>
                                            deleteMessageHandler(id)
                                          }
                                        >
                                          <i className="fe fe-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="pagination mb-4">
                    {totalPages > 1 ? (
                      [...Array(totalPages).keys()].map((page, index) => (
                        <li
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))
                    ) : totalMessages === 0 ? (
                      <li className="page-item disabled">
                        <span className="page-link">
                          Keine Nachrichten vorhanden.
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
