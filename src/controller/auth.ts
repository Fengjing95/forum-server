/*
 * @Date: 2021-07-13 16:30:51
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-14 17:57:43
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
} from '@midwayjs/decorator';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { UserService } from '../service/user';
import { Context } from 'egg';
import { jwt as JWT } from '../config/config.default';
import { RSAKey } from '../config/config.default';
import { IResponseData } from '../interface';

@Provide()
@Controller('/api/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Plugin()
  jwt: any;

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
      // token生成
      const token = await this.jwt.sign(
        {
          username: oldUser.data.name,
          id: oldUser.data.id,
          phone: oldUser.data.phone,
        },
        JWT.signature,
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
        JWT.signature,
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
    return ResponseData.success({ publicKey: RSAKey.publicKey });
  }
}
