/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-14 09:07:29
 * @FilePath: /forum-server/src/controller/user.ts
 */
import { Body } from '@midwayjs/decorator';
import {
  Inject,
  Controller,
  Post,
  Provide,
  Query,
  Get,
  ALL,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { User } from '../entity/User';
import { ResponseData, codeEnum } from '../exceptions/ResponseData';
import { IResponseData, IServiceDTO } from '../interface';
import { UserService } from '../service/user';

@Provide()
@Controller('/api/user', { middleware: ['verification'] })
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  /**
   * @description: 获取用户信息
   * @param {number} id 用户id
   * @param {string} name 用户名
   * @return {*} 用户信息
   */
  @Get('/getUser')
  async getUser(
    @Query() id: number,
    @Query() name: string
  ): Promise<IResponseData> {
    try {
      let user: IServiceDTO<User>;
      if (id) {
        user = await this.userService.getUserById(id);
      } else if (name) {
        user = await this.userService.getUserByName(name);
      } else {
        throw new Error('Bad Request');
      }
      return ResponseData.success(user);
    } catch (error) {
      this.ctx.status = codeEnum.BAD_REQUEST;
      return ResponseData.error(codeEnum.BAD_REQUEST, error.message);
    }
  }

  /**
   * @description: 暂时无用，已有注册方法auth/sign
   * @param {*} Body
   * @return {*}
   */
  @Post('/createUser')
  async createUser(@Body(ALL) user: User) {
    const result = await this.userService.createUser(user);
    if (result.success) {
      return ResponseData.success(result);
    } else {
      this.ctx.status = codeEnum.SERVER_ERROR;
      return ResponseData.error(codeEnum.SERVER_ERROR, result.message);
    }
  }
}
