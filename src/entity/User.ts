/*
 * @Date: 2021-07-13 10:38:20
 * @LastEditors: 枫
 * @description: 用户实体类
 * @LastEditTime: 2021-07-15 23:39:55
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

  @Column({
    default:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  })
  avatar: string;

  @Column()
  phone: string;

  @Column({
    default: 0,
  })
  attendanceDay: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  lastAttendance: Date;

  @Column({
    default: 0,
  })
  experience: number;

  @Column({
    default: '保密',
  })
  sex: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    length: 20,
    nullable: true,
  })
  nickname: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  signature: string;

  @CreateDateColumn()
  createTime: number;

  @UpdateDateColumn()
  updatedTime: number;
}
