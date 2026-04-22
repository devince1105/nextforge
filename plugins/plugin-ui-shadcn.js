export default {
  name: 'plugin-ui-shadcn',
  priority: 40,

  hooks: {
    async afterCreate(ctx) {
      if (ctx.config.ui !== 'shadcn') return;

      await ctx.utils.exec('npx', ['shadcn-ui@latest', 'init'], {
        cwd: ctx.projectRoot
      });
    }
  }
};
