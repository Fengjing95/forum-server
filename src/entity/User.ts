/*
 * @Date: 2021-07-13 10:38:20
 * @LastEditors: 枫
 * @description: 用户实体类
 * @LastEditTime: 2021-07-13 12:52:02
 * @FilePath: /forum-server/src/entity/User.ts
 */
import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@EntityModel('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 20,
  })
  password: string;

  @Column({
    default: 0,
  })
  role: number;

  @Column()
  avatar: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    length: 20,
  })
  nickname: string;

  @Column('text')
  signature: string;

  @CreateDateColumn()
  createTime: number;

  @UpdateDateColumn()
  updatedTime: number;
}
