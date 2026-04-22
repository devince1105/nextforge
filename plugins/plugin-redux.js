export default {
  name: 'plugin-redux',
  priority: 50,

  hooks: {
    async afterCreate(ctx) {
      if (!ctx.config.features?.redux) return;

      await ctx.utils.exec('npm', ['install', '@reduxjs/toolkit', 'react-redux'], {
        cwd: ctx.projectRoot
      });
    }
  }
};
