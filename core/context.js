import { execa } from 'execa';

/**
 * 建立插件執行的環境上下文
 */
export function createContext({ projectRoot, config }) {
  return {
    projectRoot,
    config,
    // 注入基礎工具，讓插件不需重複導入
    utils: {
      exec: async (cmd, args, options = {}) => {
        return await execa(cmd, args, {
          stdio: 'inherit',
          ...options
        });
      }
    },
    state: new Map() // 用於插件間交換資料
  };
}
