import path from 'node:path';

export default {
  name: 'plugin-nextjs',
  priority: 100,

  hooks: {
    async create(ctx) {
      if (ctx.config.template !== 'nextjs') return;

      const projectName = path.basename(ctx.projectRoot);
      const pm = ctx.config.packageManager || 'pnpm';
      const execCmd = pm === 'npm' ? 'npx' : (pm === 'yarn' ? 'yarn' : 'pnpm');
      const execArgs = pm === 'npm' ? ['create-next-app@latest'] : (pm === 'yarn' ? ['create', 'next-app'] : ['dlx', 'create-next-app@latest']);

      await ctx.utils.exec(execCmd, [
        ...execArgs,
        projectName,
        '--typescript',
        '--tailwind',
        '--eslint',
        '--app',
        '--src-dir',
        '--import-alias', '@/*',
        '--no-git',
        `--use-${pm}`
      ]);
    }
  }
};
