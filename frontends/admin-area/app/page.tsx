"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./_context/AuthContext";

import {
  BlogArticleViewsOverview,
  getViewsOverview
} from "@/app/_services/blog-article.service";
import UnauthorizedException from "./_common/Exceptions/unauthorized-exception";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [articleViewsOverview, setArticleViewsOverview] = useState<BlogArticleViewsOverview>();

  getViewsOverview()
    .then((viewsOverview) => {
      setArticleViewsOverview(viewsOverview);
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

  return (
    <>
      {isLoggedIn && (
        <div className="main-content app-content mt-0">
          <div className="side-app">
            <div className="main-container container-fluid">
              <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <div>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Pages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Dashboard
                    </li>
                  </ol>
                </div>
              </div>
              <div className="row ">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xl-12">
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
                      <div className="card overflow-hidden">
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="mt-2">
                              <h6 className="">Today</h6>
                              <h2 className="mb-0 number-font">{articleViewsOverview?.Today}</h2>
                            </div>
                            <div className="ms-auto">
                              <div className="chart-wrapper mt-1">
                                <canvas id="leadschart"
                                  className="h-8 w-9 chart-dropshadow"></canvas>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
                      <div className="card overflow-hidden">
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="mt-2">
                              <h6 className="">Last Week</h6>
                              <h2 className="mb-0 number-font">{articleViewsOverview?.ThisWeek}</h2>
                            </div>
                            <div className="ms-auto">
                              <div className="chart-wrapper mt-1">
                                <canvas id="profitchart"
                                  className="h-8 w-9 chart-dropshadow"></canvas>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
                      <div className="card overflow-hidden">
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="mt-2">
                              <h6 className="">Last Month</h6>
                              <h2 className="mb-0 number-font">{articleViewsOverview?.ThisMonth}</h2>
                            </div>
                            <div className="ms-auto">
                              <div className="chart-wrapper mt-1">
                                <canvas id="costchart"
                                  className="h-8 w-9 chart-dropshadow"></canvas>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xl-3">
                      <div className="card overflow-hidden">
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="mt-2">
                              <h6 className="">Total</h6>
                              <h2 className="mb-0 number-font">{articleViewsOverview?.AllTime}</h2>
                            </div>
                            <div className="ms-auto">
                              <div className="chart-wrapper mt-1">
                                <canvas id="saleschart"
                                  className="h-8 w-9 chart-dropshadow"></canvas>
                              </div>
                            </div>
                          </div>
                        </div>
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
