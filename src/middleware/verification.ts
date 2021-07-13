/*
 * @Date: 2021-07-13 15:55:02
 * @LastEditors: 枫
 * @description: 全局token校验中间件
 * @LastEditTime: 2021-07-13 16:30:38
 * @FilePath: /forum-server/src/middleware/verification.ts
 */
import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';

@Provide()
export class Verification implements IWebMiddleware {
  /**
   * 校验白名单
   */
  whitelist: string[] = ['/api/auth/login', '/api/auth/sign'];

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      if (this.whitelist.includes(ctx.request.url.split('?')[0])) {
        await next();
      } else {
        if (ctx.request.header.authorization) {
          await next();
        } else {
          ctx.response.body = ResponseData.error(
            codeEnum.UNAUTHORIZED,
            '不合法的身份'
          );
        }
      }
    };
  }
}
