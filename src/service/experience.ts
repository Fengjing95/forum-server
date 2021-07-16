/*
 * @Date: 2021-07-16 22:15:46
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-16 22:28:22
 * @FilePath: /forum-server/src/service/experience.ts
 */
import { Provide, Config } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { InsertResult, Repository } from 'typeorm';
import { Experience } from '../entity/Experience';
import { User } from '../entity/User';
import { expType } from '../exceptions/enums';

@Provide()
export class ExperienceService {
  @InjectEntityModel(Experience)
  experienceModel: Repository<Experience>;

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
    if (days <= this.additionConfig.PERCENTAGE_1)
      expValue *= this.additionConfig.PERCENTAGE_1;
    else if (days <= this.additionConfig.PERCENTAGE_2)
      expValue *= this.additionConfig.PERCENTAGE_2;
    else if (days <= this.additionConfig.PERCENTAGE_3)
      expValue *= this.additionConfig.PERCENTAGE_3;
    else if (days <= this.additionConfig.PERCENTAGE_4)
      expValue *= this.additionConfig.PERCENTAGE_4;
    else expValue *= this.additionConfig.PERCENTAGE_5;
    return expValue;
  }
}
