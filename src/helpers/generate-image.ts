import { createCanvas } from 'canvas';
// @ts-ignore
import { renderIcon } from '@download/blockies';

const canvas = createCanvas(50, 50);

const cache: string[] = new Array(21000);

export const generateImage = (token: number): string => {
  if (cache[token - 1]) {
    return cache[token - 1];
  }
  const icon = renderIcon({
    seed: token.toString(),
    color: '#dddd44',
    bgcolor: '#774455',
    size: 10,
    scale: 100,
    spotcolor: '#dd2233',
  }, canvas);
  const str = icon.toDataURL().split(',')[1]; // ltrim "data:image/png;base64,"
  cache[token - 1] = str;
  return str;
};
