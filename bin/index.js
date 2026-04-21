#!/usr/bin/env node

import { execa } from 'execa';

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ 請提供專案名稱：npx nextforge <project-name>');
  process.exit(1);
}

console.log(`🚀 建立 Next.js 專案：${projectName}`);

try {
  await execa(
    'npx',
    [
      'create-next-app@latest',
      projectName,
      '--typescript',
      '--eslint',
    ],
    { stdio: 'inherit' }
  );

  console.log(`✅ 專案 "${projectName}" 建立完成！`);
  console.log(`\n👉 下一步：`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm run dev`);
} catch (error) {
  console.error('❌ 建立失敗：', error.message);
  process.exit(1);
}
