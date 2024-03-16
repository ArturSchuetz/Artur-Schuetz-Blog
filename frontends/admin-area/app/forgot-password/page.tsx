"use client";

import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  if (isLoggedIn) {
    router.push("/");
  }
  return (
    <div className="login-img">
      <div className="page">
        <div className="">
          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <form className="login100-form validate-form">
                <span className="login100-form-title pb-5">
                  Forgot Password
                </span>
                <p className="text-muted">
                  Enter the email address registered on your account
                </p>
                <div
                  className="wrap-input100 validate-input input-group"
                  data-bs-validate="Valid email is required: ex@abc.xyz"
                >
                  <span className="input-group-text bg-white text-muted">
                    <i className="zmdi zmdi-email" aria-hidden="true"></i>
                  </span>
                  <input
                    className="input100 border-start-0 ms-0 form-control"
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <div className="submit">
                  <a className="btn btn-primary d-grid" href="index.html">
                    Submit
                  </a>
                </div>
                <div className="text-center mt-4">
                  <p className="text-dark mb-0">
                    Forgot It?
                    <Link className="text-primary ms-1" href="/login">
                      Send me Back
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
