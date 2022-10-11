import { createCanvas } from "canvas";
// @ts-ignore
import { renderIcon } from "@download/blockies";
import { environment } from "../environment";

const canvas = createCanvas(50, 50);

const cache: string[] = new Array(21000);

type Network = 'harmain' | 'fuji' | 'mumbai' | 'polygon';

const CHAIN_DATA: Record<Network, any[]> = {
  harmain: ["#dddd44", "#774455", "#dd2233", "", 10],
  fuji: ["#dddd44", "#774455", "#dd2233", "", 10],
  mumbai: ["#803bd4", "#b176ea", "#413f67", "^&", 10],
  polygon: ["#803bd4", "#b176ea", "#413f67", "^&", 10],
};

export const generateImage = (token: number): string => {
  if (cache[token - 1]) {
    return cache[token - 1];
  }
  const [color, bgcolor, spotcolor, seedSalt, size] =
    CHAIN_DATA[environment.NETWORK as Network];
  const icon = renderIcon(
    {
      seed: token.toString() + seedSalt,
      color,
      bgcolor,
      size,
      scale: 100,
      spotcolor,
    },
    canvas
  );
  const str = icon.toDataURL().split(",")[1]; // ltrim "data:image/png;base64,"
  cache[token - 1] = str;
  return str;
};
