import { createCanvas } from 'canvas';
// @ts-ignore
import { renderIcon } from '@download/blockies';

const canvas = createCanvas(50, 50);

export const generateImage = (token: number): string => {
  // TODO benchmark - can cache, but do we need caching?
  console.log(`GENERATING IMAGE ${token}`);
  const icon = renderIcon({
    seed: token.toString(),
    color: '#dd4',
    bgcolor: '#745',
    size: 10,
    scale: 10,
    spotcolor: '#d23',
  }, canvas);
  return icon.toDataURL().split(',')[1]; // ltrim "data:image/png;base64,"
};
