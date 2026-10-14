export interface HealthResponse {
  status: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
}
