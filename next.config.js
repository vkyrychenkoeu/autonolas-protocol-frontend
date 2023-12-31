/* eslint-disable no-param-reassign */
const withAntdLess = require('next-plugin-antd-less');
const path = require('path');

const nextConfig = {
  ...withAntdLess({
    lessVarsFilePath: './styles/variables.less',
    lessVarsFilePathAppendToEndOfContent: false,
    cssLoaderOptions: {},
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    trailingSlash: true,
    reactStrictMode: true,
    output: 'export',
    images: {
      unoptimized: true,
    },
    webpack(config) {
      config.resolve.alias.react = path.resolve('./node_modules/react');
      config.resolve.alias['react-dom'] = path.resolve('./node_modules/react-dom');
      config.resolve.alias.antd = path.resolve('./node_modules/antd');
      config.resolve.alias['styled-components'] = path.resolve('./node_modules/styled-components');

      return config;
    },
  }),
  
  publicRuntimeConfig: {
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_ID,
    INFURA_TO_PUBLIC_ADDRESS: process.env.INFURA_TO_PUBLIC_ADDRESS,
    TEST_NETWORK: process.env.TEST_NETWORK,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports =  nextConfig;
