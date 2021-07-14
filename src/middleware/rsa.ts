/*
 * @Date: 2021-07-14 16:05:06
 * @LastEditors: 枫
 * @description: 解密中间件
 * @LastEditTime: 2021-07-14 17:47:56
 * @FilePath: /forum-server/src/middleware/rsa.ts
 */
import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { unlock } from '../util/unlock';

@Provide()
export class Rsa implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        const password = ctx.request.body.password;
        ctx.request.body.password = unlock(password);
        await next();
      } catch (error) {
        ctx.response.status = codeEnum.BAD_REQUEST;
        ctx.response.body = ResponseData.error(
          codeEnum.BAD_REQUEST,
          '非法的登陆请求'
        );
        ctx.logger.error('未使用公钥进行加密');
      }
    };
  }
}
