import { PluginRegistry } from '../plugins/registry.js';

export class PluginExecutor {
  /**
   * 執行指定命令的完整生命週期
   */
  static async run(command, context) {
    const plugins = PluginRegistry.getAll();

    // 定義各命令的生命週期圖譜 (Lifecycle Graph)
    const lifecycleMap = {
      create: [
        'init',          
        'resolve',       
        'validate',      
        'beforeCreate',  
        'create',        
        'afterCreate',   
        'destroy'        
      ]
    };

    const phases = lifecycleMap[command];
    if (!phases) throw new Error(`[Executor] 未知的命令類型: ${command}`);

    // 按 Phase -> Plugin 順序執行 Pipeline
    for (const phase of phases) {
      for (const plugin of plugins) {
        const handler = plugin.hooks?.[phase];
        if (typeof handler !== 'function') continue;

        try {
          // 執行插件並傳入 Context
          await handler(context);
        } catch (err) {
          console.warn(`\n⚠️  [plugin:${plugin.name}] 於 ${phase} 階段執行失敗:`);
          console.warn(`   > ${err.message}\n`);
        }
      }
    }
  }
}
