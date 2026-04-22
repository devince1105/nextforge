import path from 'node:path';

export default {
  name: 'plugin-nextjs',
  priority: 100,

  hooks: {
    async create(ctx) {
      if (ctx.config.template !== 'nextjs') return;

      const projectName = path.basename(ctx.projectRoot);
      await ctx.utils.exec('npx', [
        'create-next-app@latest',
        projectName,
        '--typescript',
        '--tailwind',
        '--eslint',
        '--app',
        '--src-dir',
        '--import-alias', '@/*',
        '--no-git'
      ]);
    }
  }
};
