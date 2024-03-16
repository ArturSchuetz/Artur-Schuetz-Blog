"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/public/css/style.css";
import "@/public/css/dark-style.css";
import "@/public/css/transparent-style.css";
import "@/public/css/skin-modes.css";
import "@/public/css/icons.css";
import "@/public/colors/color1.css";

import Header from "./_components/_layout/header";
import SideMenu from "./_components/_layout/navigation";
import Footer from "./_components/_layout/footer";
import { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./_context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const noLayout =
    pathName === "/register" ||
    pathName === "/login" ||
    pathName === "/forgot-password" ||
    pathName === "/reset-password";

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min");
    }
  }, []);

  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, user-scalable=0"
          />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>Artur Schütz Blog Administration</title>
          <meta name="description" content="Artur Schütz Administration" />
          <meta name="author" content="Artur Schütz" />
          <meta name="robots" content="noindex,nofollow" />
        </head>
        {noLayout && <body className="app sidebar-mini ltr">{children}</body>}
        {!noLayout && (
          <body className="app sidebar-mini ltr">
            <div className="horizontalMenucontainer">
              <div className="page">
                <div className="page-main">
                  <Header />
                  <SideMenu />
                  {children}
                </div>
              </div>
              <Footer />
            </div>
          </body>
        )}
      </html>
    </AuthProvider>
  );
}
