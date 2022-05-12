import { createCanvas } from 'canvas';
// @ts-ignore
import { renderIcon } from '@download/blockies';

const canvas = createCanvas(50, 50);

const cache: string[] = new Array(21000);

const CHAIN_DATA = {
  hartest: ['#dddd44', '#774455', '#dd2233', '', 10],
  harmain: ['#dddd44', '#774455', '#dd2233', '', 10],
  mumbai:  ['#8347e5', '#f6f3a7', '#45017a', 'fdfd', 11],
  polygon: ['#8347e5', '#f6f3a7', '#45017a', '^&', 11],
};

export const generateImage = (token: number): string => {
  if (cache[token - 1]) {
    return cache[token - 1];
  }
  const [color, bgcolor, spotcolor, seedSalt, size] = CHAIN_DATA[process.env.NETWORK];
  const icon = renderIcon({
    seed: token.toString() + seedSalt,
    color,
    bgcolor,
    size,
    scale: 100,
    spotcolor,
  }, canvas);
  const str = icon.toDataURL().split(',')[1]; // ltrim "data:image/png;base64,"
  cache[token - 1] = str;
  return str;
};
