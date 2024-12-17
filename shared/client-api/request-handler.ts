import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  Method,
} from 'axios';

let requestHandler: RequestHandler;

export const getRequestHandler = (): RequestHandler => {
  return requestHandler;
};

export const createRequestHandler = (
  authorizedConfig?: (
    config: AxiosRequestConfig,
  ) => Promise<AxiosRequestConfig>,
  unauthorizedConfig?: (
    config: AxiosRequestConfig,
  ) => Promise<AxiosRequestConfig>,
): RequestHandler => {
  requestHandler = new RequestHandler(authorizedConfig, unauthorizedConfig);
  return requestHandler;
};

const baseUrl = process.env.REACT_APP_API_URL || '';

export interface RequestHandlerParams {
  method: Method;
  url: string;
  hasAuthentication?: boolean;
  data?: unknown;
  headers?: AxiosRequestHeaders;
}

export class RequestHandler {
  public authorizedConfig: (
    config: AxiosRequestConfig,
  ) => Promise<AxiosRequestConfig>;

  public unauthorizedConfig: (
    config: AxiosRequestConfig,
  ) => Promise<AxiosRequestConfig>;

  constructor(
    authorizedConfig?: (
      config: AxiosRequestConfig,
    ) => Promise<AxiosRequestConfig>,
    unauthorizedConfig?: (
      config: AxiosRequestConfig,
    ) => Promise<AxiosRequestConfig>,
  ) {
    if (authorizedConfig) {
      this.authorizedConfig = authorizedConfig;
    }
    if (unauthorizedConfig) {
      this.unauthorizedConfig = unauthorizedConfig;
    }
  }

  public request = async <T>(
    params: RequestHandlerParams,
  ): Promise<AxiosResponse<T> | AxiosError> => {
    try {
      let config: AxiosRequestConfig = {
        method: params.method,
        url: `${baseUrl}${params.url}`,
        data: params.data,
        headers: params.headers,
      };
      if (params.hasAuthentication) {
        if (this.authorizedConfig) {
          config = await this.authorizedConfig(config);
        }
        return await axios(config);
      }
      if (this.unauthorizedConfig) {
        config = await this.unauthorizedConfig(config);
      }
      return await axios(config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error;
      }
      console.error('API Request Failed: ', error);
      throw error;
    }
  };
}
