"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

import { login } from "../_services/auth.service";
import { useAuth } from "../_context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  if (isLoggedIn) {
    router.push("/");
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const loginResult = await login({
        username,
        password,
      });
      setError("");

      setUsername("");
      setPassword("");
      setIsLoading(false);
      setIsLoggedIn(true);

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setIsLoading(false);
      setIsLoggedIn(false);

      if (error instanceof Error) {
        setError(`${error.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login-img">
      <div className="page">
        <div className="">
          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <form
                className="login100-form validate-form"
                onSubmit={handleSubmit}
              >
                <span className="login100-form-title pb-5">Login</span>
                <div className="panel panel-primary">
                  <div className="panel-body tabs-menu-body p-0 pt-5">
                    <div className="tab-content">
                      <div className="tab-pane active" id="tab5">
                        <div className="wrap-input100 validate-input input-group">
                          <span className="input-group-text bg-white text-muted">
                            <i
                              className="zmdi zmdi-account text-muted"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <input
                            className="input100 border-start-0 form-control ms-0"
                            name="username"
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                          />
                        </div>
                        <div
                          className="wrap-input100 validate-input input-group"
                          id="Password-toggle"
                        >
                          <span className="input-group-text bg-white text-muted">
                            <i
                              className="zmdi zmdi-eye text-muted"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <input
                            className="input100 border-start-0 form-control ms-0"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        {error && (
                          <div className="alert alert-danger">{error}</div>
                        )}
                        <div className="text-end pt-4">
                          <p className="mb-0">
                            <Link
                              href="/forgot-password"
                              className="text-primary ms-1"
                            >
                              Forgot Password?
                            </Link>
                          </p>
                        </div>
                        <div className="container-login100-form-btn">
                          {isLoading ? (
                            <button
                              type="button"
                              disabled
                              className="login100-form-btn btn-primary"
                            >
                              Loading...
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="login100-form-btn btn-primary"
                            >
                              Login
                            </button>
                          )}
                        </div>
                        <div className="text-center pt-3">
                          <p className="text-dark mb-0">
                            Not a member?
                            <Link
                              href="/register"
                              className="text-primary ms-1"
                            >
                              Sign Up
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
