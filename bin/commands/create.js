import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../../lib/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = path.join(__dirname, '../../templates');

function safeInject({ projectRoot, basePath, targetPath, templatePath, force }) {
  const fullTargetPath = path.join(projectRoot, basePath, targetPath);
  const fullTemplatePath = path.join(TEMPLATES_ROOT, templatePath);

  if (!fullTargetPath.startsWith(projectRoot)) {
    logger.error(`🚨 Security check failed: ${targetPath}`);
    return;
  }

  if (!fs.existsSync(fullTemplatePath)) {
    logger.warn(`⚠️ Template missing: ${templatePath}`);
    return;
  }

  if (fs.existsSync(fullTargetPath) && !force) {
    logger.info(`ℹ️ Skipping ${targetPath} (exists). Use --force to overwrite.`);
    return;
  }

  const dirPath = path.dirname(fullTargetPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = fs.readFileSync(fullTemplatePath, 'utf8');
  fs.writeFileSync(fullTargetPath, content, 'utf8');
  logger.success(`✅ Created: ${basePath}/${targetPath}`);
}

export async function create(projectName, options = {}) {
  const projectRoot = path.join(process.cwd(), projectName);

  try {
    logger.info(`🚀 Starting create-next-app for "${projectName}"...`);
    
    await execa(
      'npx',
      [
        'create-next-app@latest',
        projectName,
        '--typescript',
        '--tailwind',
        '--eslint',
        '--app',
        '--src-dir',
        '--import-alias', '@/*',
        '--no-git'
      ],
      { stdio: 'inherit' }
    );

    const basePath = 'src';
    const fullBasePath = path.join(projectRoot, basePath);

    if (!fs.existsSync(fullBasePath)) {
      logger.error(`❌ Project structure error: ${basePath} directory not found.`);
      process.exit(1);
    }

    if (options.withAuth) {
      safeInject({ projectRoot, basePath, targetPath: 'lib/api.ts', templatePath: 'lib/api.ts', force: options.force });
      safeInject({ projectRoot, basePath, targetPath: 'lib/auth.ts', templatePath: 'lib/auth.ts', force: options.force });
    }

    if (options.withRedux) {
      safeInject({ projectRoot, basePath, targetPath: 'store/index.ts', templatePath: 'store/index.ts', force: options.force });
    }

    const deps = [];
    if (options.withAuth) deps.push('axios');
    if (options.withRedux) deps.push('@reduxjs/toolkit', 'react-redux');

    if (deps.length > 0) {
      logger.info(`📦 Installing project dependencies: ${deps.join(', ')}...`);
      await execa('npm', ['install', ...deps], { 
        cwd: projectRoot, 
        stdio: 'inherit' 
      });
    }

    logger.success(`✨ Nextforge v0.5 project "${projectName}" is ready!`);
  } catch (error) {
    logger.error(`❌ Initialization failed: ${error.message}`);
    process.exit(1);
  }
}
