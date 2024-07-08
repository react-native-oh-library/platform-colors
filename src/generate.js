const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const parseColorManifest = require('@klarna/platform-colors/src/parse-color-manifest');
const { formatName } = require('./utils');

const generators = {
  harmony: require('./templates/harmony'),
  ios: require('@klarna/platform-colors/src/templates/ios'),
  android: require('@klarna/platform-colors/src/templates/android'),
  css: require('@klarna/platform-colors/src/templates/css'),
  javascript: require('@klarna/platform-colors/src/templates/javascript'),
};

async function generate(config) {
  const colors = parseColorManifest(config.colors);
  const { outputDirectory } = config.ios;
  const prefix = formatName('ios', config);

  const entries = await fg(`${path.join(outputDirectory, prefix)}*.colorset`, {
    onlyFiles: false,
  });

  await Promise.all(
    entries.map(async (dir) => {
      const exist = await fs.pathExists(dir);
      if (exist) {
        await fs.remove(dir);
      }
    })
  );

  const output = Object.keys(generators)
    .filter((platform) => config[platform])
    .reduce((acc, platform) => {
      const { outputDirectory } = config[platform];

      const generator = generators[platform];
      const files = generator(colors, config).map(([filename, contents]) => [
        path.resolve(outputDirectory, filename),
        contents,
      ]);

      return acc.concat(files);
    }, []);

  await Promise.all(
    output.map(([filename, contents]) => fs.outputFile(filename, contents))
  );

  return colors;
}

module.exports = generate;
