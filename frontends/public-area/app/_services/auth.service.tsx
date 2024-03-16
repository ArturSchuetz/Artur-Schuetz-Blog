import { getConfig } from "@/config";
import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";
import { fetchWithTokenRefresh } from "./helper.service";

export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
}
export interface RegisterUserResponse {}

export interface LoginUserRequest {
  username: string;
  password: string;
}
export interface LoginUserResponse {
  token: string;
}

export interface LogoutUserRequest {}
export interface LogoutUserResponse {}

const authUrl = getConfig().apiUrl + "/auth";

export const register = async (
  registerInput: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const url = `${authUrl}/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerInput),
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as RegisterUserResponse;
};

export const login = async (
  loginInput: LoginUserRequest
): Promise<LoginUserResponse> => {
  const url = `${authUrl}/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginInput),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as LoginUserResponse;
};

export const logout = async (
  logoutInput: LogoutUserRequest
): Promise<LogoutUserResponse> => {
  const url = `${authUrl}/logout`;
  const response = await fetchWithTokenRefresh(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logoutInput),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return data;
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(data.message);
      throw new Error(data.message);
    }
  }

  return {} as LogoutUserResponse;
};
