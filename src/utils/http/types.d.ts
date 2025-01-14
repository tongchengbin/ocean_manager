import Axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";

export type resultType = {
  token?: string;
};

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}
export interface ApiResponse<T> extends AxiosRequestConfig {
  data: T;
  results: T[];
  total: number;
  code: number;
  msg: string;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
}


export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T>;
  post<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P>;
  get<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P>;
}
