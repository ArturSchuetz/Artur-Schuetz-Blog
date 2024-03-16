"use client";
import UnauthorizedException from "@/app/_common/Exceptions/unauthorized-exception";
import { logout } from "@/app/_services/auth.service";
import { User, getCurrentUser } from "@/app/_services/user.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getConfig } from "@/config";
import { useAuth } from "@/app/_context/AuthContext";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
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
  }, [router, setIsLoggedIn]);

  const handleLogoutRequest: () => void = () => {
    logout({}).then(() => {
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    });
  };
  return (
    <>
      {isLoggedIn && (
        <>
          <div className="jumps-prevent" style={{ paddingTop: "74px" }}></div>
          <div className="app-header header sticky">
            <div className="container-fluid main-container">
              <div className="d-flex">
                <Link className="logo-horizontal" href="/">
                  <Image
                    src="/images/brand/logo.png"
                    className="header-brand-img desktop-logo"
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

                <div className="d-flex order-lg-2 ms-auto header-right-icons">
                  <button
                    className="navbar-toggler navresponsive-toggler d-lg-none ms-auto"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent-4"
                    aria-controls="navbarSupportedContent-4"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon fe fe-more-vertical"></span>
                  </button>
                  <div className="navbar navbar-collapse responsive-navbar p-0">
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent-4"
                    >
                      <div className="d-flex order-lg-2">
                        {user && (
                          <div className="dropdown d-flex profile-1">
                            <a
                              data-bs-toggle="dropdown"
                              className="nav-link leading-none d-flex"
                            >
                              {user?.avatarImageId === null && (
                                <Image
                                  src="/images/users/21.jpg"
                                  alt="profile-user"
                                  className="avatar  profile-user brround cover-image"
                                  width={50}
                                  height={50}
                                />
                              )}
                              {user?.avatarImageId !== null && (
                                <Image
                                  src={`${getConfig().apiUrl}/medias/${
                                    user.avatarImageId
                                  }`}
                                  alt="profile-user"
                                  className="avatar  profile-user brround cover-image"
                                  width={50}
                                  height={50}
                                />
                              )}
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                              <div className="drop-heading">
                                <div className="text-center">
                                  <h5 className="text-dark mb-0 fs-14 fw-semibold">
                                    {user?.firstName} {user?.lastName}
                                  </h5>
                                  <small className="text-muted">
                                    {user?.role}
                                  </small>
                                </div>
                              </div>
                              <div className="dropdown-divider m-0"></div>
                              <Link
                                onClick={handleLogoutRequest}
                                className="dropdown-item"
                                href="/"
                              >
                                <i className="dropdown-icon fe fe-alert-circle"></i>{" "}
                                Sign out
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
