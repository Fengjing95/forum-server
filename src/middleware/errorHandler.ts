/*
 * @Date: 2021-07-14 09:14:41
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-15 23:55:31
 * @FilePath: /forum-server/src/middleware/errorHandler.ts
 */
import { Logger, Provide } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';

@Provide()
export class ErrorHandler implements IWebMiddleware {
  @Logger('coreLogger')
  logger: ILogger;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        await next();
      } catch (error) {
        this.logger.error('server error:' + error.message);
        ctx.response.status = codeEnum.SERVER_ERROR;
        ctx.response.body = ResponseData.error(
          codeEnum.SERVER_ERROR,
          'server error:' + error.message
        );
      }
    };
  }
}
