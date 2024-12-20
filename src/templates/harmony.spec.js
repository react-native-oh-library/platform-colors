/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

const generate = require('./harmony');
const parseColorManifest = require('@klarna/platform-colors/src/parse-color-manifest');
const lightColors = parseColorManifest(require('@klarna/platform-colors/src/templates/fixtures/light-colors.json'));
const darkColors = parseColorManifest(require('@klarna/platform-colors/src/templates/fixtures/dark-colors.json'));

describe('harmony template', () => {
  it.each([
    ['light', lightColors],
    ['dark', darkColors],
  ])('generates %s colors', (name, colors) => {
    expect(generate(colors)).toMatchSnapshot();
  });
});
