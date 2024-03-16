"use client";

import Link from "next/link";
import { useAuth } from "../_context/AuthContext";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
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
                <span className="login100-form-title pb-5">Reset Password</span>
                <p className="text-muted">
                  Enter new password for your account
                </p>
                <div
                  className="wrap-input100 validate-input input-group"
                  data-bs-validate="Valid email is required: ex@abc.xyz"
                >
                  <a href="" className="input-group-text bg-white text-muted">
                    <i className="zmdi zmdi-eye" aria-hidden="true"></i>
                  </a>
                  <input
                    className="input100 border-start-0 form-control ms-0"
                    type="password"
                    placeholder="New Password"
                  />
                </div>
                <div
                  className="wrap-input100 validate-input input-group"
                  data-bs-validate="Valid email is required: ex@abc.xyz"
                >
                  <a href="" className="input-group-text bg-white text-muted">
                    <i className="zmdi zmdi-eye" aria-hidden="true"></i>
                  </a>
                  <input
                    className="input100 border-start-0 form-control ms-0"
                    type="password"
                    placeholder="Repeat Password"
                  />
                </div>
                <div className="submit">
                  <a className="btn btn-primary d-grid" href="">
                    Reset
                  </a>
                </div>
                <div className="text-center mt-4">
                  <p className="text-dark mb-0">
                    <Link className="text-primary ms-1" href="/login">
                      Back to Login
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
