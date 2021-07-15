/*
 * @Date: 2021-07-13 15:55:02
 * @LastEditors: 枫
 * @description: 全局token校验中间件
 * @LastEditTime: 2021-07-15 10:59:03
 * @FilePath: /forum-server/src/middleware/verification.ts
 */
import { Provide, Plugin, Config, Inject } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { RedisService } from '../service/redis';

@Provide()
export class Verification implements IWebMiddleware {
  @Plugin()
  jwt: any;

  @Config('jwt')
  JWTConfig: any;

  @Inject()
  redisService: RedisService;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      // if (this.whitelist.includes(ctx.request.url.split('?')[0])) {
      //   await next();
      // } else {
      try {
        // 验证token
        const authRes = this.jwt.verify(
          ctx.request.header.authorization,
          this.JWTConfig.signature
        );
        let redisSign =
          (await this.redisService.getClient().get(`t_${authRes.id}`)) ?? '{}';
        redisSign = JSON.parse(redisSign);
        let verifyFlag: boolean;
        // ctx.logger.error(redisSign);

        // 判断设备,根据设备类型存储redis标识
        if (
          ctx.request.header['user-agent'].match(/(iPhone|iPod|Android|ios)/i)
        ) {
          verifyFlag = redisSign.phone === authRes.randomSign;
        } else {
          verifyFlag = redisSign.pc === authRes.randomSign;
        }
        if (verifyFlag) {
          ctx.identify = authRes;
          await next();
        } else {
          throw new Error('无效的token');
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
            '不合法的身份:' + error.message
          );
        }
      }
      // }
    };
  }
}
