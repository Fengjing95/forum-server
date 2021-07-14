/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-14 11:04:01
 * @FilePath: /forum-server/src/config/config.default.ts
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1626104196042_7134';

  // add your config here
  config.middleware = ['errorHandler'];

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };

  // config.security = {
  //   csrf: false,
  // };
  return config;
};

export const orm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'remote',
  password: '123456',
  database: 'forum',
  synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
  logging: false,
};
// 配置CORS
export const cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
};
// 允许跨域的域名
export const security = {
  domainWhiteList: ['http://localhost:8000'], //  允许跨域的域名
};
// jwt密钥盐值
export const jwt = {
  signature: 'eGlhb2Zlbmc=', // xiaofeng -> base64
};
