/**
 * Plugin Runtime Context
 * 作為插件與 Core 之間的通訊橋樑
 */
export class PluginContext {
  constructor({ projectRoot, config = {}, version = null }) {
    this.projectRoot = projectRoot;
    this.config = config;
    this.version = version;
    this.state = new Map(); // 用於存儲插件間共享的私有狀態
    this.timestamp = Date.now();
  }

  /**
   * 儲存共享數據
   */
  set(key, value) {
    this.state.set(key, value);
  }

  /**
   * 讀取共享數據
   */
  get(key) {
    return this.state.get(key);
  }

  /**
   * 導出所有狀態
   */
  getAllState() {
    return Object.fromEntries(this.state);
  }
}
