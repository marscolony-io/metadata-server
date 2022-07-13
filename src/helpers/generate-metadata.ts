import { CONTRACTS } from "../blockchain/contracts-addresses";
import { attribute, getData } from "../services/TokenService";
import { Attribute } from "../types";

const toRad = (phi: number): number => (phi * Math.PI) / 180;
const toDeg = (phi: number): number => (phi / Math.PI) * 180;

const cos = (value: number): number => Math.cos(toRad(value));
const acos = (value: number): number => toDeg(Math.acos(value));

const toLongPart = (val: number): number => {
  return val % 150;
};

const toLatPart = (val: number): number => {
  return Math.floor(val / 150);
};

const parseTokenNumber = (tokenNumber: number): { x: number; y: number } => {
  const y = toLatPart(tokenNumber - 1);
  const x = toLongPart(tokenNumber - 1);
  return { x, y };
};

const toLong = (val: number): number => {
  return ((val - 150 / 2) / 150) * 360;
};

const toLat = (val: number): number => {
  if (val === 70) {
    return 0;
  }
  if (val < 70) {
    return 90 - acos(cos(90) + ((70 - val) * (cos(10) - cos(90))) / 70); // > 0
  }
  if (val > 70) {
    return -toLat(140 - val); // < 0
  }
  return 0; // for ts
};

const generateDescription = (token: number): string => {
  const { x, y } = parseTokenNumber(token);
  const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
  const longitudes: [number, number] = [toLong(x), toLong(x + 1)];
  latitudes.sort((a: number, b: number) => a - b);
  longitudes.sort((a: number, b: number) => a - b);
  return `Land plot #${token}`;
};

const generateAttributes = async (
  token: number
): Promise<Attribute[] | null> => {
  const { x, y } = parseTokenNumber(token);
  const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
  const longitudes: [number, number] = [toLong(x), toLong(x + 1)];
  latitudes.sort((a: number, b: number) => a - b);
  longitudes.sort((a: number, b: number) => a - b);
  const data = await getData(token);
  if (data === null) {
    return null;
  }
  return [
    attribute(
      "Longitudes",
      `${longitudes[0].toFixed(8)} - ${longitudes[1].toFixed(8)}`
    ),
    attribute(
      "Latitudes",
      `${latitudes[0].toFixed(8)} - ${latitudes[1].toFixed(8)}`
    ),
    ...data,
  ];
};

export const generateMetadata = async (
  token: number
): Promise<Record<string, string | Record<string, any>> | null> => {
  const attributes = await generateAttributes(token);
  if (attributes === null) {
    return null;
  }
  return {
    name: `Land Plot #${token}`,
    description: generateDescription(token),
    image: `${CONTRACTS.meta}${token}.png`,
    attributes,
  };
};
