"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

import { RegisterUserRequest, register } from "../_services/auth.service";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import { useAuth } from "../_context/AuthContext";

export default function Register() {
  const countDownStartTime: number = 5;

  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  if (isLoggedIn) {
    router.push("/");
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(countDownStartTime);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleRepeatPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRepeatPassword(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      setSuccess("");
      return;
    }

    setIsLoading(true);
    try {
      const createdUser = await register({
        username,
        email,
        password,
      } as RegisterUserRequest);
      setError("");
      setSuccess(
        "User created successfully! Please verify your email to continue."
      );
      setIsLoading(false);

      setUsername("");
      setEmail("");
      setPassword("");
      setRepeatPassword("");

      let timer = countDownStartTime;
      setCountdown(countDownStartTime);

      const intervalId = setInterval(() => {
        timer--;
        setCountdown(timer);

        if (timer === 0) {
          clearInterval(intervalId);
          throw new UnauthorizedException();
        }
      }, 1000);
    } catch (error: unknown) {
      setSuccess("");
      setIsLoading(false);

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
        <div>
          <div className="container-login100">
            <div className="wrap-login100 p-6">
              <form
                className="login100-form validate-form"
                onSubmit={handleSubmit}
              >
                {!success.trim() ? (
                  <>
                    <span className="login100-form-title">Registration</span>
                    <div
                      className="wrap-input100 validate-input input-group"
                      data-bs-validate="Valid email is required: ex@abc.xyz"
                    >
                      <span className="input-group-text bg-white text-muted">
                        <i className="zmdi zmdi-account" aria-hidden="true"></i>
                      </span>
                      <input
                        className="input100 border-start-0 ms-0 form-control"
                        name="username"
                        type="text"
                        placeholder="User name"
                        value={username}
                        onChange={handleUsernameChange}
                      />
                    </div>
                    <div className="wrap-input100 validate-input input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="zmdi zmdi-email" aria-hidden="true"></i>
                      </span>
                      <input
                        className="input100 border-start-0 ms-0 form-control"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      id="Password-toggle"
                    >
                      <span className="input-group-text bg-white text-muted">
                        <i className="zmdi zmdi-eye" aria-hidden="true"></i>
                      </span>
                      <input
                        className="input100 border-start-0 ms-0 form-control"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div
                      className="wrap-input100 validate-input input-group"
                      id="Password-toggle"
                    >
                      <span className="input-group-text bg-white text-muted">
                        <i className="zmdi zmdi-eye" aria-hidden="true"></i>
                      </span>
                      <input
                        className="input100 border-start-0 ms-0 form-control"
                        name="repeatPassword"
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <>
                    <div className="alert alert-success">{success}</div>
                    <div className="alert alert-info">
                      Redirecting in {countdown} seconds...
                    </div>
                  </>
                )}
                {!success.trim() ? (
                  <>
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
                          Register
                        </button>
                      )}
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-dark mb-0">
                        Already have account?
                        <Link className="text-primary ms-1" href="/login">
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Back to{" "}
                      <Link className="text-primary ms-1" href="/login">
                        Login
                      </Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
