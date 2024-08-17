/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import Logger from './Logger';

export class RNPlatformColorsTurboModule extends TurboModule implements TM.KLAPlatformColors.Spec {
  // 校验是否rgba格式的颜色值
  private rgbaReg = /^rgba\((\d{1,3}\,){3}\d{1,3}\)$/;

  public resolveColor(color: string): Promise<string> {
    return new Promise((resolve) => {
      Logger.debug('resolveColor color is:', JSON.stringify(color));
      resolve(this.resolve(color))
    })
  }

  public resolveColorSync(color: string): string {
    Logger.debug('resolveColorSync color is:', JSON.stringify(color));
    return this.resolve(color);
  }

  private resolve(color: string): string {
    if (!this.isColorValid(color)) {
      return '';
    }
    let convertedColor = this.convertColorToHex(color);
    Logger.info('convertedColor is:' + convertedColor);
    return convertedColor;
  }

  private isColorValid(color: string): boolean {
    if (!color) {
      Logger.warn('param color is null');
      return false;
    }
    color = color.replaceAll(' ', '');
    if (this.rgbaReg.test(color)) {
      return true;
    }
    Logger.warn('invalid rgba string');
    return false;
  }

  private convertColorToHex(color): string {
    let rgbValues = this.getRgbaValue(color);
    let alpha = parseFloat(rgbValues[3] || 1);
    let red = Math.floor(alpha * parseInt(rgbValues[0]) + (1 - alpha) * 255).toString(16).padStart(2, '0');
    let green = Math.floor(alpha* parseInt(rgbValues[1]) + (1 - alpha) * 255).toString(16).padStart(2, '0');
    let blue = Math.floor(alpha * parseInt(rgbValues[2]) + (1 - alpha) * 255).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
  }

  private getRgbaValue(color) {
    let values = [];
    // 提取rgb值
    color.replace(/\d{1,3}/g, function(rgba) {
      values.push(rgba);
    });
    Logger.debug('getRgbaValue is', JSON.stringify(values));
    return values;
  }
}
