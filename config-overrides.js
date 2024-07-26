const path = require("path");

module.exports = {
  webpack: function (config, env) {
    return {
      ...config,
      resolve: {
        alias: {
          "@components": path.resolve(__dirname, "src/components/"),
          "@styles": path.resolve(__dirname, "src/styles/"),
          "@pages": path.resolve(__dirname, "src/pages/"),
          "@redux": path.resolve(__dirname, "src/redux/"),
          "@assets": path.resolve(__dirname, "src/assets/"),
          "@utils": path.resolve(__dirname, "src/utils/"),
          "@hooks": path.resolve(__dirname, "src/hooks/"),
          "@layouts": path.resolve(__dirname, "src/layouts/"),
          "@routes": path.resolve(__dirname, "src/routes/"),
          "@data": path.resolve(__dirname, "src/data/"),
          "@hook": path.resolve(__dirname, "src/hook/"),
        },
        extensions: [
          ".js",
          ".jsx",
          ".json",
          ".scss",
          ".svg",
          ".png",
          ".jpeg",
          ".jpg",
        ],
        fallback: {
          fs: false,
          path: false,
        },
      },
    };
  },
};
