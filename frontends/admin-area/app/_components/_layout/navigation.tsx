"use client";

import Image from "next/image";
import SideMenu from "./side-menu";
import Link from "next/link";
import { useAuth } from "@/app/_context/AuthContext";

export default function Navigation() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn && (
        <div className="sticky">
          <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
          <div className="app-sidebar">
            <div className="side-header">
              <Link className="header-brand1" href="/">
                <Image
                  src="/images/brand/logo.png"
                  className="header-brand-img desktop-logo"
                  alt="logo"
                  width={150}
                  height={50}
                />
                <Image
                  src="/images/brand/logo-1.png"
                  className="header-brand-img toggle-logo"
                  alt="logo"
                  width={150}
                  height={50}
                />
                <Image
                  src="/images/brand/logo-2.png"
                  className="header-brand-img light-logo"
                  alt="logo"
                  width={150}
                  height={50}
                />
                <Image
                  src="/images/brand/logo-3.png"
                  className="header-brand-img light-logo1"
                  alt="logo"
                  width={150}
                  height={50}
                />
              </Link>
            </div>

            <div className="main-sidemenu">
              <div className="slide-left disabled" id="slide-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                </svg>
              </div>

              <SideMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
