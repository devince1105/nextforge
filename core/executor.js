import { PluginRegistry } from '../plugins/registry.js';

/**
 * 安全執行單個插件的 Hook
 * 隔離插件錯誤，防止中斷核心流程
 */
async function safeRun(plugin, hookName, context, payload) {
  const hook = plugin?.hooks?.[hookName];

  if (typeof hook !== 'function') return;

  try {
    // 執行插件邏輯，傳入 context 與 payload
    await hook(context, payload);
  } catch (err) {
    // 輸出警告但不拋出錯誤，實現 Error Isolation
    console.warn(`\n⚠️  [PLUGIN ERROR] ${plugin.name} 在執行 ${hookName} 時發生錯誤:`);
    console.warn(`   > ${err.message}\n`);
  }
}

export const PluginExecutor = {
  /**
   * 按優先級順序執行所有插件的指定 Hook
   */
  async runHook(hookName, context, payload = {}) {
    const plugins = PluginRegistry.list();

    // Sequential Pipeline: 嚴格按優先級順序執行
    for (const plugin of plugins) {
      await safeRun(plugin, hookName, context, payload);
    }
  },

  /**
   * Lifecycle Helper: 用於執行特定階段的生命週期
   */
  async runLifecycle(lifecycle, context, payload = {}) {
    // 語義化封裝，本質上是調用 runHook
    await this.runHook(lifecycle, context, payload);
  }
};
