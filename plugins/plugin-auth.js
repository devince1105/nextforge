export default {
  name: 'plugin-auth',
  priority: 50,

  hooks: {
    async afterCreate(ctx) {
      if (!ctx.config.features?.auth) return;

      await ctx.utils.exec('npm', ['install', 'axios'], {
        cwd: ctx.projectRoot
      });
    }
  }
};
