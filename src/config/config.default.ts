/*
 * @Date: 2021-07-12 23:36:36
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-15 10:47:14
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
// redis
export const redis = {
  port: 6379,
  host: '127.0.0.1',
  family: 4, // 4 (IPv4) or 6 (IPv6)
  // password: 'auth',
  db: 0,
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
// 非对称加密
export const RSAKey = {
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOrFVMKiNvh5N8XcXWvGlyEAd3
LDF5yggx1Jjmo/amyI5W4uUGf1UDktQxSaAJFQF+SSCe0wayg6QaZw880XqupK6J
R7cWBNZnJX40abalBdS0qGZ5Hv2E7DM7IwjwHxLfSITs8iTXFLyf1ngAC0tMwhc2
64x6hG4FXCvbWc3ptwIDAQAB
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAM6sVUwqI2+Hk3xd
xda8aXIQB3csMXnKCDHUmOaj9qbIjlbi5QZ/VQOS1DFJoAkVAX5JIJ7TBrKDpBpn
DzzReq6krolHtxYE1mclfjRptqUF1LSoZnke/YTsMzsjCPAfEt9IhOzyJNcUvJ/W
eAALS0zCFzbrjHqEbgVcK9tZzem3AgMBAAECgYEAt2Zshxs5uOYZthpMzuMBu6uH
xHReL1JedUHQsZM89QIydd4BGQPzwCkSze4k6wpN+fAQ14AyiEWTYa6k8fZ+o1S7
Ap1zdOd/vsJRKaQ7O5MLqsvcZ9izlYhMuOqqmG6zb/kLmaNFO1HldLG3pYx8ExwF
CnYXL9My9qVEVRFX9FkCQQD3r2sxLDfsrFsJMH173B3bJNVrhotMRrT+1EeSqpkg
I0SSwU21vuICGr50AJmfVyPT9kYspQxr1FBJOXJUrf4dAkEA1Zx2DHq8zZ2XT5TV
/K4A/MveYImwTm+P+Q1n2v3FYEMVPjKkppt7RtOOsdFLR3Wd0lbF9FlI9czTtudc
LCAO4wJAJn4LkZvGoTB0AWyYw8wEk88Yn9pMAbGnZUcGTIPYwkbY3FnQQuOEakFP
weVp+npnZgSLCVspIATh6U9VNlXH/QJADEWJzpu6fwF/sNW3GWYRrnQz2U3vsAHe
vosTnVQY47fW35TfOqcSBPagavzAG2HZaD0N8ES02VIkE4zlEa/hywJBALKSIi/W
XZoc9KtemAgo0QX3Fe5hsweOxV8bIz+CP0SNK9FI8yvL8JxK+ceMA4R8rDASXPwp
SKTHlmMqc+7Ed+c=
-----END PRIVATE KEY-----`,
};
