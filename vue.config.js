const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      }),
    ],
  },
  devServer: {
    host: "0.0.0.0", // Ascolta su tutti gli indirizzi
    port: 8080, // Porta del frontend
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // Backend Flask API
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
