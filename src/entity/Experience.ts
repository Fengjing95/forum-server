/*
 * @Date: 2021-07-16 15:46:48
 * @LastEditors: 枫
 * @description: 经验值实体
 * @LastEditTime: 2021-07-16 16:24:54
 * @FilePath: /forum-server/src/entity/Experience.ts
 */
import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { expType, status } from '../exceptions/enums';
import { User } from './User';

@EntityModel('experience')
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expValue: number;

  @Column()
  expType: expType;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, user => user.id)
  user: User;

  @Column({
    default: status.ACTIVE,
  })
  status: status;

  @CreateDateColumn()
  createTime: Date;
}
