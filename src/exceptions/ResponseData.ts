/*
 * @Date: 2021-07-13 09:40:39
 * @LastEditors: 枫
 * @description: 响应数据实体类
 * @LastEditTime: 2021-07-13 13:52:18
 * @FilePath: /forum-server/src/entity/ResponseData.ts
 */

import { Provide } from '@midwayjs/decorator';
import { IResponseData } from '../interface';

export enum codeEnum {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

@Provide()
export class ResponseData {
  statusCode: number;
  data: Record<string, any>;
  success: boolean;
  message: string;
  constructor(data, statusCode: number, success: boolean, message?: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.success = success;
    this.message = message;
  }

  /**
   * @description: 成功静态方法
   * @param {object} data 数据
   * @param {codeEnum} statusCode 状态码
   * @param {boolean} success 是否成功
   * @return {*}
   */
  static success(
    data: Record<string, any>,
    statusCode = 200,
    success = true
  ): IResponseData {
    return new ResponseData(data, statusCode, success, null);
  }

  /**
   * @description: 失败静态方法
   * @param {codeEnum} statusCode 状态码
   * @param {string} message 消息
   * @param {boolean} success 是否成功
   * @return {*}
   */
  static error(statusCode: codeEnum, message: string, success = false) {
    return new ResponseData(null, statusCode, success, message);
  }
}
