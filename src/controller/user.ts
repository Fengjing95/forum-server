/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-13 16:25:41
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
import { IResponseData } from '../interface';
import { UserService } from '../service/user';

@Provide()
@Controller('/api/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/getUser')
  async getUser(
    @Query() id: number,
    @Query() name: string
  ): Promise<IResponseData> {
    try {
      let user: User;
      if (id) {
        user = await this.userService.getUserById(id);
      } else if (name) {
        user = await this.userService.getUserByName(name);
      } else {
        throw new Error('Bad Request');
      }
      return ResponseData.success(user);
    } catch (error) {
      return ResponseData.error(codeEnum.BAD_REQUEST, error.message);
    }
  }

  @Post('/createUser')
  async createUser(@Body(ALL) user: User) {
    const result = await this.userService.createUser(user);
    if (result.success) {
      return ResponseData.success(result);
    } else {
      return ResponseData.error(codeEnum.SERVER_ERROR, result.message);
    }
  }
}
