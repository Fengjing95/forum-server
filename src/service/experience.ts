/*
 * @Date: 2021-07-16 22:15:46
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-18 00:46:11
 * @FilePath: /forum-server/src/service/experience.ts
 */
import { Provide, Config } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { InsertResult, Repository } from 'typeorm';
import { Experience } from '../entity/Experience';
import { User } from '../entity/User';
import { expType } from '../exceptions/enums';
import { IServiceDTO } from '../interface';

@Provide()
export class ExperienceService {
  @InjectEntityModel(Experience)
  experienceModel: Repository<Experience>;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Config('addition')
  additionConfig: any;

  /**
   * @description: 增加一条经验记录
   * @param {number} expV 经验值
   * @param {expType} expT 获得经验类型
   * @param {number} userId 用户ID
   * @return {*}
   */
  async addExperienceHistory(
    expV: number,
    expT: expType,
    user: User
  ): Promise<InsertResult> {
    const exp = new Experience();
    exp.expValue = expV;
    exp.expType = expT;
    exp.user = user;

    const result = await this.experienceModel.insert(exp);
    return result;
  }

  /**
   * @description: 计算经验值
   * @param {number} days 天数
   * @return {*}
   */
  getExp(days: number): number {
    let expValue = this.additionConfig.BASIS;
    // 经验值计算
    if (days <= this.additionConfig.DAY_1)
      expValue *= this.additionConfig.PERCENTAGE_1;
    else if (days <= this.additionConfig.DAY_2)
      expValue *= this.additionConfig.PERCENTAGE_2;
    else if (days <= this.additionConfig.DAY_3)
      expValue *= this.additionConfig.PERCENTAGE_3;
    else if (days <= this.additionConfig.DAY_4)
      expValue *= this.additionConfig.PERCENTAGE_4;
    else expValue *= this.additionConfig.PERCENTAGE_5;
    return expValue;
  }

  /**
   * @description: 获取经验历史
   * @param {number} current 当前页数
   * @param {number} pageSize 页容量
   * @param {number} userId 用户ID
   * @return {*} 经验历史记录列表
   */
  async getExpHistory(
    userId: number,
    current: number,
    pageSize: number
  ): Promise<IServiceDTO<Experience[]>> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    const expList = await this.experienceModel.find({
      where: { user },
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    if (expList.length) {
      return { success: true, data: expList };
    } else {
      return { success: false, message: '暂无数据' };
    }
  }
}
