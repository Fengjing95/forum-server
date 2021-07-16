/*
 * @Date: 2021-07-16 17:18:20
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2021-07-16 17:44:18
 * @FilePath: /forum-server/test/util/dateUtil.test.ts
 */
import { getNextDay, getPreDay } from '../../src/util/dateUtil';

describe('test/util/dataUtil', () => {
  it('get next day', async () => {
    // make request
    let next = getNextDay('2021-7-31');
    // use expect by jest
    expect(next).toBe('2021-8-1');

    // // or use assert
    // assert.deepStrictEqual(result.status, 200);
    // assert.deepStrictEqual(result.text, 'Hello Midwayjs!');
  });

  it('get pre day', () => {
    let pre = getPreDay('2021-7-16');

    expect(pre).toBe('2021-7-15');
  });
});
