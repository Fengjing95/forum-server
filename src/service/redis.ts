/*
 * @Date: 2021-07-15 10:16:05
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-15 10:29:34
 * @FilePath: /forum-server/src/service/redis.ts
 */
import {
  Provide,
  Scope,
  Autoload,
  ScopeEnum,
  Config,
  Init,
} from '@midwayjs/decorator';
import * as Redis from 'ioredis';

@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton)
export class RedisService {
  private redisService: any;

  @Config('redis')
  redisConfig: any;

  @Init()
  async init() {
    this.redisService = new Redis(this.redisConfig);
  }

  getClient() {
    return this.redisService;
  }
}
