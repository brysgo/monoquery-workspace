const babelOptions = {
  presets: ["env", "react"],
  plugins: [
    [
      "transform-runtime",
      {
        helpers: false,
        polyfill: false,
        regenerator: true
      }
    ]
  ]
};

module.exports = require("babel-jest").createTransformer(babelOptions);
