#!/usr/bin/env node

import path from 'node:path';
import { createContext } from '../core/context.js';
import { PluginExecutor } from '../core/executor.js';
import { loadPlugins } from '../plugins/loader.js';
import { startInteractiveFlow } from '../lib/interactive.js';

async function bootstrap() {
  // 1. 引擎初始化 (自動加載插件目錄下的所有 plugin-*.js)
  await loadPlugins();

  const [command, ...args] = process.argv.slice(2);

  // 2. 交互式獲取配置 (目前僅針對 create 或預設行為)
  const projectName = (command === 'create') ? args[0] : command;
  
  if (!projectName || projectName === 'release') {
    // 若為 release，此處可選擇性引導至原有 lib 中的 release 邏輯
    // 目前範例專注於 create 流程的引擎化
    if (projectName === 'release') {
      console.log('Release command currently active in legacy mode.');
    } else {
      console.log('Usage: nextforge <project-name>');
    }
    process.exit(0);
  }

  const config = await startInteractiveFlow();

  // 3. 建立執行上下文並啟動引擎
  const context = createContext({
    projectRoot: path.join(process.cwd(), projectName),
    config
  });

  try {
    await PluginExecutor.run('create', context);
    console.log(`\n✨ [Engine] 任務執行完成。`);
  } catch (err) {
    console.error('\n❌ [Engine] 致命中斷：', err.message);
    process.exit(1);
  }
}

bootstrap();
