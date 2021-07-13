/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-13 20:42:41
 * @FilePath: /forum-server/src/service/user.ts
 */
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/User';
import { Repository } from 'typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  /**
   * @description: 根据ID查询用户
   * @param {number} id 用户唯一标识
   * @return {User} 用户实例
   */
  async getUserById(id: number) {
    const user = await this.userModel.findOne({
      where: { id },
    });
    return user;
  }

  /**
   * @description: 根据name查询用户
   * @param {string} name 用户名
   * @return {User} 用户实例
   */
  async getUserByName(name: string) {
    const user = await this.userModel.findOne({
      where: { name },
    });
    return user;
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

    try {
      const userResult = await this.userModel.insert(user);
      console.log(userResult);
      return { success: true, ...userResult };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }

  /**
   * @description: 注册用户
   * @param {string} name 用户名
   * @param {string} password 密码
   * @param {string} phone 手机
   * @return {*}
   */
  async signUser(name: string, password: string, phone: string) {
    const user = new User();
    user.name = name;
    user.password = password;
    user.phone = phone;

    try {
      const userResult = await this.userModel.insert(user);
      return { success: true, data: userResult };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
