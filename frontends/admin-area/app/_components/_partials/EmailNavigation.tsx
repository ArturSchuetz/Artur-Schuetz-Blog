"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function EmailNavigation() {
  function setCurrentFolder(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="col-xl-3">
      <div className="card">
        <div className="list-group list-group-transparent mb-0 mail-inbox pb-3">
          <div className="mt-4 mx-4 mb-4 text-center"></div>
          <Link
            href=""
            className="list-group-item d-flex align-items-center active mx-4"
            onClick={() => setCurrentFolder("Inbox")}
          >
            <span className="icons">
              <i className="fa fa-inbox"></i>
            </span>{" "}
            Inbox{" "}
          </Link>
          <Link
            href=""
            className="list-group-item d-flex align-items-center mx-4"
            onClick={() => setCurrentFolder("Drafts")}
          >
            <span className="icons">
              <i className="fa fa-pencil"></i>
            </span>{" "}
            Drafts
          </Link>
          <Link
            href=""
            className="list-group-item d-flex align-items-center mx-4"
            onClick={() => setCurrentFolder("Sent")}
          >
            <span className="icons">
              <i className="fa fa-mail-forward"></i>
            </span>{" "}
            Sent Mail
          </Link>
          <Link
            href=""
            className="list-group-item d-flex align-items-center mx-4"
            onClick={() => setCurrentFolder("Spam")}
          >
            <span className="icons">
              <i className="fa fa-warning"></i>
            </span>{" "}
            Spam
          </Link>
          <Link
            href=""
            className="list-group-item d-flex align-items-center mx-4"
            onClick={() => setCurrentFolder("Trash")}
          >
            <span className="icons">
              <i className="fa fa-trash"></i>
            </span>{" "}
            Trash
          </Link>
        </div>
      </div>
    </div>
  );
}
