/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: types
 * @LastEditTime: 2021-07-14 09:04:16
 * @FilePath: /forum-server/src/interface/index.ts
 */

/**
 * @description: 响应体统一返回格式
 */
export interface IResponseData {
  success: boolean;
  data: Record<string, any>;
  statusCode: number;
  message?: string;
}
/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  id: string;
  name: string;
}

export interface IGetUserResponse {
  success: boolean;
  message: string;
  data: IUserOptions;
}

/**
 * @description service方法返回值类型
 */
export interface IServiceDTO<T> {
  success: boolean;
  data?: T;
  message?: string;
}
