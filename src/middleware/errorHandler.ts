/*
 * @Date: 2021-07-14 09:14:41
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-14 09:28:53
 * @FilePath: /forum-server/src/middleware/errorHandler.ts
 */
import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';

@Provide()
export class ErrorHandler implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        await next();
      } catch (error) {
        ctx.response.status = codeEnum.SERVER_ERROR;
        ctx.response.body = ResponseData.error(
          codeEnum.SERVER_ERROR,
          'server error:' + error.message
        );
      }
    };
  }
}
