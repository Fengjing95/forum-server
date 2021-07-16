/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-16 23:20:33
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
import { expType } from '../exceptions/enums';
import { ResponseData, codeEnum } from '../exceptions/ResponseData';
import { IResponseData, IServiceDTO } from '../interface';
import { ExperienceService } from '../service/experience';
import { UserService } from '../service/user';

@Provide()
@Controller('/api/user', { middleware: ['verification'] })
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  expService: ExperienceService;

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
    let user: IServiceDTO<User>;
    if (id) {
      user = await this.userService.getUserById(id);
    } else if (name) {
      user = await this.userService.getUserByName(name);
    } else {
      return ResponseData.error(codeEnum.BAD_REQUEST, 'Bad Request');
    }
    if (user.success) {
      return ResponseData.success(user.data);
    } else {
      return ResponseData.error(codeEnum.BAD_REQUEST, user.message);
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

  /**
   * @description: 签到接口
   * @param {*}
   * @return {*} 用户的签到情况:连续签到天数,当次签到获得经验值
   */
  @Get('/attendance')
  async attendance(): Promise<IResponseData> {
    const {
      success,
      data: dailyData,
      message,
    } = await this.userService.attendance(this.ctx.identify.id);
    if (success) {
      const expValue = this.expService.getExp(dailyData.attendanceDay);
      // this.ctx.logger.error(expValue);

      // 更新经验
      await this.userService.updateExperience(expValue, dailyData.id);

      // 增加经验记录
      await this.expService.addExperienceHistory(
        expValue,
        expType.DAILY_ATTENDANCE,
        dailyData
      );
      const result = {
        days: dailyData.attendanceDay,
        exp: expValue,
      };
      return ResponseData.success(result);
    } else {
      return ResponseData.error(codeEnum.BAD_REQUEST, message);
    }
  }
}
