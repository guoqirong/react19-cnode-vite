import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

export default ({ mode, command }) => {
  // 环境变量处理
  const envData = loadEnv(mode, process.cwd(), 'REACT_APP');
  const envObj: any = {};
  Object.keys(envData).forEach((key) => {
    envObj[`process.env.${key}`] = `"${envData[key]}"`;
  });

  return defineConfig({
    define:
      command === 'serve'
        ? {
            global: {},
            'process.env.NODE_ENV': `"${mode}"`,
            'process.env.RUN_COMMAND': `"${command}"`,
            ...envObj
          }
        : {
            'process.env.NODE_ENV': `"${mode}"`,
            'process.env.RUN_COMMAND': `"${command}"`,
            ...envObj
          },
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  })
}