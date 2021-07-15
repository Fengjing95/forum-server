/*
 * @Date: 2021-07-14 15:53:41
 * @LastEditors: 枫
 * @description: 使用私钥解锁密文
 * @LastEditTime: 2021-07-15 09:13:09
 * @FilePath: /forum-server/src/util/unlock.ts
 */
const NodeRSA = require('node-rsa');

export function unlock(encrypted: string, priKey: string): string {
  const privateKey = new NodeRSA(priKey, 'pkcs8-private-pem', {
    environment: 'node',
  });
  // privateKey.importKey(RSAKey.privateKey, 'pkcs8-private-pem');
  // console.log(RSAKey.privateKey);
  return privateKey.decrypt(encrypted, 'utf8');
}

export function lock(str: string, pubKey: string): string {
  const publicKey = new NodeRSA(pubKey, 'pkcs8-public-pem', {
    environment: 'node',
  });
  // publicKey.importKey(RSAKey.publicKey, 'pkcs8-public-pem');
  return publicKey.encrypt(str, 'base64');
}
