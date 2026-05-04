export default {
  name: 'plugin-auth',
  priority: 50,

  hooks: {
    async afterCreate(ctx) {
      if (!ctx.config.features?.auth) return;

      const pm = ctx.config.packageManager || 'pnpm';
      const installCmd = pm === 'npm' ? 'install' : 'add';
      await ctx.utils.exec(pm, [installCmd, 'axios'], {
        cwd: ctx.projectRoot
      });
    }
  }
};
