/*
 * @Date: 2021-07-14 16:05:06
 * @LastEditors: 枫
 * @description: 解密中间件
 * @LastEditTime: 2021-07-15 23:57:18
 * @FilePath: /forum-server/src/middleware/rsa.ts
 */
import { Config, Logger, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { unlock } from '../util/unlock';
import { ILogger } from '@midwayjs/logger';

@Provide()
export class Rsa implements IWebMiddleware {
  @Config()
  RSAKey: any;

  @Logger('coreLogger')
  logger: ILogger;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      try {
        const password = ctx.request.body.password;
        // ctx.logger.error(lock(password, ctx.app.config.RSAKey.publicKey));
        ctx.request.body.password = unlock(password, this.RSAKey.privateKey);
        await next();
      } catch (error) {
        ctx.response.status = codeEnum.BAD_REQUEST;
        ctx.response.body = ResponseData.error(
          codeEnum.BAD_REQUEST,
          '非法的登陆请求'
        );
        this.logger.error('未使用公钥进行加密');
      }
    };
  }
}
