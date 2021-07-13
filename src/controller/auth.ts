/*
 * @Date: 2021-07-13 16:30:51
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-13 19:24:40
 * @FilePath: /forum-server/src/controller/auth.ts
 */
import { Body, Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { codeEnum, ResponseData } from '../exceptions/ResponseData';
import { UserService } from '../service/user';

@Provide()
@Controller('/api/auth')
export class AuthController {
  @Inject()
  userService: UserService;

  @Post('/login')
  async login(
    @Body('username') name: string,
    @Body('password') password: string
  ) {
    let result;
    const oldUser = await this.userService.getUserByName(name);
    if (oldUser && oldUser.name === name && oldUser.password === password) {
      // TODO token生成
      result = ResponseData.success({ token: '123' });
    } else {
      result = ResponseData.error(codeEnum.BAD_REQUEST, '用户名或密码错误');
    }
    return result;
  }

  @Post('/sign')
  async sign(
    @Body('username') name: string,
    @Body('password') password: string,
    @Body('phone') phone: string
  ) {
    const oldUser = await this.userService.getUserByName(name);
    if (oldUser) {
      return ResponseData.error(codeEnum.BAD_REQUEST, '用户名已经存在');
    }
    const result = await this.userService.signUser(name, password, phone);
    if (result.success) {
      return ResponseData.success(result);
    } else {
      return ResponseData.error(
        codeEnum.BAD_REQUEST,
        '注册失败: ' + result.message
      );
    }
  }
}
