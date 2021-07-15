/*
 * @Date: 2021-07-13 15:55:02
 * @LastEditors: 枫
 * @description: 全局token校验中间件
 * @LastEditTime: 2021-07-15 09:32:33
 * @FilePath: /forum-server/src/middleware/verification.ts
 */
import { Provide, Plugin } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';

@Provide()
export class Verification implements IWebMiddleware {
  @Plugin()
  jwt: any;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      // if (this.whitelist.includes(ctx.request.url.split('?')[0])) {
      //   await next();
      // } else {
      try {
        const authRes = this.jwt.verify(
          ctx.request.header.authorization,
          ctx.app.config.jwt.signature
        );
        if (authRes) {
          ctx.identify = authRes;
          await next();
        } else {
          throw new Error('登陆过期');
        }
      } catch (error) {
        if (error.message === 'jwt expired') {
          ctx.response.status = codeEnum.UNAUTHORIZED;
          ctx.response.body = ResponseData.error(
            codeEnum.UNAUTHORIZED,
            '登陆过期'
          );
        } else {
          ctx.logger.error(error.message);
          ctx.response.status = codeEnum.UNAUTHORIZED;
          ctx.response.body = ResponseData.error(
            codeEnum.UNAUTHORIZED,
            '不合法的身份'
          );
        }
      }
      // }
    };
  }
}
