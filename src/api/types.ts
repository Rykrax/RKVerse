export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data: T;
}

export interface ApiMessageResponse {
  status?: number;
  message?: string;
}
