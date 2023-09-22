import axios from "axios";

import {
  UserLoginPayloadType,
  UserSignupPayloadType,
  UserType,
} from "@/interfaces/user";
import { baseApi } from "@/utils/baseApi";

export function signUpApi(
  payload: UserSignupPayloadType
): Promise<{ data: UserType }> {
  return axios.post("/auth/sign_up", payload, {
    baseURL: `${baseApi.v1}`,
  });
}

export function loginApi(
  payload: UserLoginPayloadType
): Promise<{
  data: { data: { token: string; user: UserType & { _id: string } } };
}> {
  return axios.post("/auth/login", payload, {
    baseURL: `${baseApi.v1}`,
  });
}

export function adminLoginApi(
  payload: UserLoginPayloadType
): Promise<{ data: { data: { token: string; user: UserType } } }> {
  return axios.post("/auth/admin/login", payload, {
    baseURL: `${baseApi.v1}`,
  });
}

export function resetPasswordApi(payload: {
  email: string;
}): Promise<{ data: { message: string; statusCode: number } }> {
  return axios.post("/auth/reset", payload, {
    baseURL: `${baseApi.v1}`,
  });
}

export function logoutApi(): Promise<{ data: UserType }> {
  return axios.get("/auth/logout", {
    baseURL: `${baseApi.v1}`,
  });
}
