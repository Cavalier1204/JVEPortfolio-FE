import { AxiosResponse } from "axios";
import apiClient from "./apiClient";
import { HealthResponse } from "../types";

export default function checkServerHealth(): Promise<
  AxiosResponse<HealthResponse>
> {
  return apiClient.get<HealthResponse>("/health");
}
