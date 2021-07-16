/*
 * @Date: 2021-07-16 17:03:09
 * @LastEditors: 枫
 * @description: 日期处理工具
 * @LastEditTime: 2021-07-16 17:43:46
 * @FilePath: /forum-server/src/util/dateUtil.ts
 */
export function dateString(d: Date): string {
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
/**
 * @description: 比较两个日期是否相同
 * @param {string} fDate
 * @param {string} sDate
 * @return {*}
 */
export function compareDate(fDate: string, sDate: string): boolean {
  if (fDate === sDate) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description: 获取下一天
 * @param {*}
 * @return {*}
 */
export function getNextDay(d: string): string {
  let t = new Date(d).getTime();
  t += 1000 * 60 * 60 * 24;
  const next = new Date(t);
  return dateString(next);
}

/**
 * @description: 获取前一天
 * @param {*}
 * @return {*}
 */
export function getPreDay(d: string): string {
  let t = new Date(d).getTime();
  t -= 1000 * 60 * 60 * 24;
  const pre = new Date(t);
  return dateString(pre);
}
