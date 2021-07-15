/*
 * @Date: 2021-07-15 10:16:05
 * @LastEditors: 枫
 * @description: redis单例
 * @LastEditTime: 2021-07-15 11:43:52
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
