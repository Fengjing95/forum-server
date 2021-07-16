/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-16 23:19:44
 * @FilePath: /forum-server/src/service/user.ts
 */
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/User';
import { InsertResult, Repository } from 'typeorm';
import { IServiceDTO } from '../interface';
import { compareDate, dateString, getNextDay } from '../util/dateUtil';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  /**
   * @description: 根据ID查询用户
   * @param {number} id 用户唯一标识
   * @return {User} 用户实例
   */
  async getUserById(id: number): Promise<IServiceDTO<User>> {
    const user = await this.userModel.findOne({
      where: { id },
    });
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, message: 'User not found' };
    }
  }

  /**
   * @description: 根据name查询用户
   * @param {string} name 用户名
   * @return {User} 用户实例
   */
  async getUserByName(name: string): Promise<IServiceDTO<User>> {
    const user = await this.userModel.findOne({
      where: { name },
    });
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, message: 'User not found' };
    }
  }

  /**
   * @description: 创建用户
   * @param {User} user 用户实例
   * @return {*}
   */
  async createUser(user: User) {
    // const user = new User();
    // user.name = 'John';
    // user.password = '123123';
    // user.nickname = 'King';
    // user.email = '746925560@qq.com';
    // user.phone = '15684135998';
    // user.role = 1;
    // user.avatar = '12';
    // user.signature = '123';

    const userResult = await this.userModel.insert(user);
    if (userResult) {
      return { success: true, ...userResult };
    } else {
      return { success: false, message: '创建失败' };
    }
  }

  /**
   * @description: 注册用户
   * @param {string} name 用户名
   * @param {string} password 密码
   * @param {string} phone 手机
   * @return {*}
   */
  async signUser(
    name: string,
    password: string,
    phone: string
  ): Promise<IServiceDTO<InsertResult>> {
    const user = new User();
    user.name = name;
    user.password = password;
    user.phone = phone;

    const userResult = await this.userModel.insert(user);
    if (userResult) {
      return { success: true, data: userResult };
    } else {
      return { success: false, message: '注册失败' };
    }
  }

  /**
   * @description: 签到
   * @param {number} userId 用户ID
   * @return {*}
   */
  async attendance(userId: number): Promise<IServiceDTO<User>> {
    const { success, data: user, message } = await this.getUserById(userId);
    if (success) {
      const last = user.lastAttendance
        ? dateString(new Date(user.lastAttendance))
        : '1970-01-01';
      const now = dateString(new Date());
      if (last === now) return { success: false, message: '今天已经签到' };
      const flag = compareDate(getNextDay(last), now);
      if (flag) {
        user.attendanceDay += 1;
        user.lastAttendance = new Date();
      } else {
        user.attendanceDay = 1;
        user.lastAttendance = new Date();
      }
      const result = await this.userModel.save(user);
      return { success: true, data: result };
    } else {
      return { success, message };
    }
  }

  /**
   * @description: 获取签到信息
   * @param {number} userId 用户ID
   * @return {*}
   */
  // async getAttendance(userId: number): Promise<IServiceDTO<User>> {}

  /**
   * @description: 更新用户经验值
   * @param {number} expV 经验值
   * @param {number} userId 用户id
   * @return {*}
   */
  async updateExperience(expV: number, userId: number): Promise<User> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    user.experience += expV;
    // TODO 判断经验值和等级的关系
    const updateResult = await this.userModel.save(user);
    return updateResult;
  }
}
