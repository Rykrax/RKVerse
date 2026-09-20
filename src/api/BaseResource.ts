// src/api/BaseResource.ts
import type { AxiosRequestConfig } from "axios";
import axiosClient from "../utils/bearerRequest";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const DEFAULT_BASE_PATH = `${BACKEND_URL}`;

// Thêm generic TItem và TCreate với giá trị mặc định là any
export default class BaseResource<TItem = any, TCreate = any> {
  protected uri: string;
  protected baseURL: string;

  constructor(uri: string, baseURL: string = DEFAULT_BASE_PATH) {
    this.uri = uri;
    this.baseURL = baseURL;
  }

  protected _handleError(error: unknown): Promise<never> {
    return Promise.reject(error);
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      return (await axiosClient({
        ...config,
        baseURL: config.baseURL ?? this.baseURL,
        url: config.url,
      })) as T;
    } catch (error) {
      return this._handleError(error);
    }
  }

  list<T = any>(params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}`,
      method: "get",
      params,
    });
  }

  get<T = any>(id: string | number): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}/${id}`,
      method: "get",
    });
  }

  /** Helper method cho post tùy biến đường dẫn */
  post<T = any, D = any>(
    path: string = "",
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const url = path
      ? `/${this.uri}/${path}`.replace(/\/+/g, "/")
      : `/${this.uri}`;
    return this.request<T>({
      ...config,
      url,
      method: "post",
      data,
    });
  }

  /** Dùng type generic TCreate và TItem */
  create<T = TItem, D = TCreate>(data: D): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}`,
      method: "post",
      data,
    });
  }

  update<T = any, D = any>(id: string | number, data: D): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}/${id}`,
      method: "put",
      data,
    });
  }

  patch<T = any, D = any>(id: string | number, data: D): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}/${id}`,
      method: "patch",
      data,
    });
  }

  delete<T = any>(id: string | number): Promise<T> {
    return this.request<T>({
      url: `/${this.uri}/${id}`,
      method: "delete",
    });
  }
}
