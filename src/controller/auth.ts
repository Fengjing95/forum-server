/*
 * @Date: 2021-07-13 16:30:51
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-15 11:28:26
 * @FilePath: /forum-server/src/controller/auth.ts
 */
import {
  Body,
  Controller,
  Inject,
  Post,
  Provide,
  Plugin,
  Get,
  Config,
} from '@midwayjs/decorator';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { UserService } from '../service/user';
import { Context } from 'egg';
import { IResponseData } from '../interface';
import { RedisService } from '../service/redis';

@Provide()
@Controller('/api/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  redisService: RedisService;

  @Plugin()
  jwt: any;

  @Config('jwt')
  JWTConfig: any;

  @Config()
  RSAKey: any;

  /**
   * @description: 登陆
   * @param {string} name 用户名
   * @param {string} password 密码（rsa公钥加密）
   * @return {*}
   */
  @Post('/login', { middleware: ['rsa'] })
  async login(
    @Body('username') name: string,
    @Body('password') password: string
  ): Promise<IResponseData> {
    if (!name || !password) {
      return ResponseData.error(codeEnum.BAD_REQUEST, '用户名或密码不可为空');
    }
    let result;
    const oldUser = await this.userService.getUserByName(name);
    if (
      oldUser.success &&
      oldUser.data.name === name &&
      oldUser.data.password === password
    ) {
      // 生成随机数存储redis
      let random = '';
      for (let i = 0; i < 6; i++) {
        random += Math.floor(Math.random() * 10);
      }
      if (
        this.ctx.request.header['user-agent'].match(
          /(iPhone|iPod|Android|ios)/i
        )
      ) {
        this.redisService
          .getClient()
          .set(`t_${oldUser.data.id}`, JSON.stringify({ phone: random }));
      } else {
        this.redisService
          .getClient()
          .set(`t_${oldUser.data.id}`, JSON.stringify({ pc: random }));
      }

      // token生成
      const token = await this.jwt.sign(
        {
          username: oldUser.data.name,
          id: oldUser.data.id,
          phone: oldUser.data.phone,
          randomSign: random,
        },
        this.JWTConfig.signature,
        { expiresIn: 60 * 60 * 24 }
      );
      result = ResponseData.success({ token });
    } else {
      this.ctx.status = codeEnum.BAD_REQUEST;
      result = ResponseData.error(codeEnum.BAD_REQUEST, '用户名或密码错误');
    }
    return result;
  }

  /**
   * @description: 注册
   * @param {string} name 用户名
   * @param {string} password 密码（使用公钥加密）
   * @param {string} phone 手机号
   * @return {*}
   */
  @Post('/sign', { middleware: ['rsa'] })
  async sign(
    @Body('username') name: string,
    @Body('password') password: string,
    @Body('phone') phone: string
  ): Promise<IResponseData> {
    if (!name || !password || !phone) {
      return ResponseData.error(codeEnum.BAD_REQUEST, '必填信息不可为空');
    }
    const oldUser = await this.userService.getUserByName(name);
    if (oldUser.success) {
      this.ctx.status = codeEnum.BAD_REQUEST;
      return ResponseData.error(codeEnum.BAD_REQUEST, '用户名已经存在');
    }
    const result = await this.userService.signUser(name, password, phone);
    if (result.success) {
      const token = await this.jwt.sign(
        {
          username: name,
          id: result.data.identifiers[0].id,
          phone: phone,
        },
        this.JWTConfig.signature,
        { expiresIn: 60 * 60 * 24 }
      );
      return ResponseData.success({ token });
    } else {
      this.ctx.status = codeEnum.BAD_REQUEST;
      return ResponseData.error(
        codeEnum.BAD_REQUEST,
        '注册失败: ' + result.message
      );
    }
  }

  /**
   * @description: 获取公钥
   * @param {*}
   * @return {*}
   */
  @Get('/publicKey')
  getPublicKey(): IResponseData {
    return ResponseData.success({
      publicKey: this.RSAKey.publicKey,
    });
  }

  /**
   * @description: 登出,清除redis中存的sign
   * @param {*}
   * @return {*}
   */
  @Get('/logout', { middleware: ['verification'] })
  async logout(): Promise<IResponseData> {
    const redisIndex = 't_' + this.ctx.identify.id;
    const successFlag = await this.redisService.getClient().del(redisIndex);
    return ResponseData.success({ success: successFlag });
  }
}
