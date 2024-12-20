/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

const path = require('path');
const fs = require('fs-extra');
const { formatName } = require('../utils');

function stringifyColor(color) {
  return color.hex();
}

const getColorResourcesIfExists = (config, filename) => {
  if (config && config.harmony && config.harmony.outputDirectory) {
    const outputDirectory = config.harmony.outputDirectory;
    const filePath = path.join(outputDirectory, filename);
    if (fs.existsSync(filePath)) {
      const jsonStr = fs.readFileSync(filePath).toString();
      const colorJson = JSON.parse(jsonStr);

      return colorJson.color;
    }
  }

  return;
};

const fileManifest = [
  {
    filename: 'base/element/color.json',
    colorName: 'light',
  },
  {
    filename: 'dark/element/color.json',
    colorName: 'dark',
  },
];

module.exports = function generateHarmony(colors, config) {
  return fileManifest
    .map(({ filename, colorName }) => {
      const values = colors.filter((color) => color[colorName]);
      return { filename, colorName, values };
    })
    .filter(({ values }) => values.length !== 0)
    .map(({ filename, colorName, values }) => {
      const resources = getColorResourcesIfExists(config, filename);
      const prefix = formatName('harmony', config);

      const colorsMap = resources && resources.length ? resources : [];

      const manualResources =
        colorsMap
          .filter((c) => !c['name'].startsWith(prefix))
          .map((c) => (c)) || [];

      const generatedResources = values.map((color) => ({
        'name': formatName('harmony', config, color.name),
        'value': stringifyColor(color[colorName]),
      }));

      const mergeResources = {
        color: [
          ...manualResources,
          ...generatedResources,
        ]
      }
      return [filename, JSON.stringify(mergeResources, null, 2)];
    });
};