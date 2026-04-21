const registry = new Map();

export const PluginRegistry = {
  /**
   * 註冊一個插件實例
   */
  register(plugin) {
    if (!plugin || !plugin.name) {
      throw new Error('[PluginRegistry] 註冊失敗：插件必須具備 name 屬性');
    }
    
    // 設定預設優先級
    if (plugin.priority == null) {
      plugin.priority = 0;
    }

    registry.set(plugin.name, plugin);
  },

  /**
   * 獲取指定名稱的插件
   */
  get(name) {
    return registry.get(name);
  },

  /**
   * 列出所有註冊的插件 (依優先級降序排序)
   */
  list() {
    return Array.from(registry.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  },

  /**
   * 清空註冊中心
   */
  clear() {
    registry.clear();
  }
};
