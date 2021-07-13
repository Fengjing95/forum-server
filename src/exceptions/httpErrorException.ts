/*
 * @Date: 2021-07-13 14:02:38
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-13 14:07:49
 * @FilePath: /forum-server/src/exceptions/httpErrorException.ts
 */
export class HttpErrorException extends Error {
  statusCode: number;
  success: boolean;
  constructor(message = 'server error', statusCode = 500, success = false) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
  }
}
