import { PluginRegistry } from './registry.js';

/**
 * 載入插件隊列
 * @param {Array} pluginList 插件實例數組
 */
export async function loadPlugins(pluginList = []) {
  if (!Array.isArray(pluginList)) return;

  for (const plugin of pluginList) {
    try {
      PluginRegistry.register(plugin);
    } catch (error) {
      console.error(`[PluginLoader] 無法載入插件 ${plugin?.name}:`, error.message);
    }
  }
}
