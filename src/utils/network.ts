import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BackendResultFormat<T = any> {
  code: number;
  message: string;
  data: T;
}

const SUCCESS_CODE = 1000;

export const serverAddress = '10.0.2.2:9233';

const instance = axios.create({
  baseURL: `http://${serverAddress}`,
  timeout: 5000,
});

// 请求拦截
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      Promise.reject(config);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

interface RequestConfig extends AxiosRequestConfig {
  url: NonNullable<AxiosRequestConfig['url']>;
}

type RequestResult<T> = {
  data: null | T;
  error: any;
};

// 约束响应数据
async function makeRequest<ResData>(
  config: RequestConfig,
): Promise<RequestResult<ResData>>;
// 约束响应数据，请求数据
async function makeRequest<ResData, ReqData>(
  config: Omit<RequestConfig, 'data'> & { data: ReqData },
): Promise<RequestResult<ResData>>;
// 约束响应数据，请求数据，请求参数
async function makeRequest<ResData, ReqData, ReqParam>(
  config: Omit<RequestConfig, 'data' | 'params'> &
    (ReqData extends undefined ? { data?: undefined } : { data: ReqData }) & {
      params: ReqParam;
    },
): Promise<RequestResult<ResData>>;
// 实现
async function makeRequest<ResData>(
  config: RequestConfig,
): Promise<RequestResult<ResData>> {
  try {
    const response = await instance.request<BackendResultFormat<ResData>>(
      config,
    );
    const { code, data, message } = response.data;

    if (code !== SUCCESS_CODE) {
      return { data: null, error: new Error(message) };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export { makeRequest };
