import { PluginExecutor } from './executor.js';
import { PluginContext } from './context.js';

/**
 * 封裝專案建立流程 (完整生命週期版)
 */
export async function runCreate(projectRoot, config = {}) {
  const context = new PluginContext({ projectRoot, config });

  // 1. 初始化階段
  await PluginExecutor.runLifecycle('init', context);
  
  // 2. 解析階段
  await PluginExecutor.runLifecycle('resolve', context);
  
  // 3. 驗證階段
  await PluginExecutor.runLifecycle('validate', context);

  // 4. 執行前階段
  await PluginExecutor.runHook('beforeCreate', context);

  // --- Core logic placeholder start ---
  console.log(`[Core] 正在 ${projectRoot} 建立專案...`);
  // --- Core logic placeholder end ---

  // 5. 執行後階段
  await PluginExecutor.runHook('afterCreate', context);

  // 6. 銷毀/清理階段
  await PluginExecutor.runLifecycle('destroy', context);
}

/**
 * 封裝發布發布流程 (完整生命週期版)
 */
export async function runRelease(projectRoot, version) {
  const context = new PluginContext({ projectRoot, version });

  // 1. 初始化階段
  await PluginExecutor.runLifecycle('init', context);

  // 2. 發布前階段
  await PluginExecutor.runHook('beforeRelease', context, { version });

  // --- Core logic placeholder start ---
  console.log(`[Core] 正在發布版本 v${version}...`);
  // --- Core logic placeholder end ---

  // 3. 發布後階段
  await PluginExecutor.runHook('afterRelease', context, { version });

  // 4. 銷毀/清理階段
  await PluginExecutor.runLifecycle('destroy', context);
}
