"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import {
  getMessageById,
  markMessageAsRead,
  Message,
} from "@/app/_services/message.service";
import { MarkdownService } from "@/app/_services/markdown.service";
import EmailNavigation from "@/app/_components/_partials/EmailNavigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";

export default function InboxMessage({
  params,
}: {
  params: { messageId: number };
}) {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const messageId = params.messageId;
  const [message, setMessage] = useState<Message | null>(null);
  let htmlText: string | null = null;
  if (message?.message)
    htmlText = MarkdownService.convertWithSpacesAndTabs(message.message);

  const createdAtString = message?.createdAt
    ? new Date(message.createdAt).toLocaleString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessage = await getMessageById(messageId);
      setMessage(fetchedMessage);
      await markMessageAsRead(messageId);
    };

    fetchData();
  }, [messageId]);

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
                    <li className="breadcrumb-item">
                      <Link href={`/inbox`}>Message Inbox</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Message
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row">
                <EmailNavigation />
                <div className="col-xl-9">
                  <div className="card">
                    <div className="card-body">
                      <div className="email-media">
                        <div className="mt-0 d-sm-flex">
                          <div className="media-body pt-0">
                            <div className="float-end d-none d-md-flex fs-15">
                              <small className="me-3 mt-3 text-muted">
                                {createdAtString}
                              </small>
                              <div className="me-3">
                                <a
                                  href="javascript:void(0)"
                                  className="text-danger email-icon bg-danger-transparent"
                                  data-bs-toggle="dropdown"
                                  role="button"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <i className="fe fe-more-horizontal"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0)"
                                  >
                                    <i className="fe fe-alert-circle me-2"></i>
                                    Mark as Spam
                                  </a>
                                  <a
                                    className="dropdown-item"
                                    href="javascript:void(0)"
                                  >
                                    <i className="fe fe-trash me-2"></i>Move to
                                    Trash
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="media-title text-dark font-weight-semibold mt-1">
                              {message?.name}{" "}
                              <span className="text-muted font-weight-semibold">
                                ( {message?.email} )
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="eamil-body mt-5">
                        {htmlText && (
                          <div
                            dangerouslySetInnerHTML={{ __html: htmlText }}
                          ></div>
                        )}
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
