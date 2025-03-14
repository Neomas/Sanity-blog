const path = require("path");

module.exports = {
  i18n: {
    localeDetection: false,
    defaultLocale: "en",
    locales: ["en",  "fr"],
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: true,
};
