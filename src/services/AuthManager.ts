import apiClient from "./apiClient";
import { User } from "../types";

async function signin(username: string, password: string): Promise<User> {
  const response = await apiClient.post<User>("/user/signin", {
    username,
    password,
  });
  return response.data;
}

async function logout(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>("/user/logout");
  return response.data;
}

async function getMe(): Promise<User> {
  const response = await apiClient.get<User>("/user/me");
  return response.data;
}

const AuthManager = {
  signin,
  logout,
  getMe,
};

export default AuthManager;
