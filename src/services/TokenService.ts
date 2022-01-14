import Web3 from 'web3';
import { TESTNET_CLNY, TESTNET_GM, TESTNET_NFT } from '../blockchain/contracts';
import CLNY from '../abi/CLNY.json';
import MC from '../abi/MC.json';
import GM from '../abi/GameManager.json';
import { AbiItem } from 'web3-utils';
import { Attribute, IStorage } from '../types';

const nodes = process.env.TESTNET
  ? [
    'https://api.s0.b.hmny.io',
  ]
  : [
    'https://harmony-0-rpc.gateway.pokt.network',
    'https://api.harmony.one',
    'https://api.fuzz.fi/',
  ];

const connections = nodes.map((node: string) => new Web3(node));

const web3 = new Web3(
  process.env.TESTNET
    ? 'https://api.s0.b.hmny.io'
    : 'https://api.harmony.one',
);

const clny = new web3.eth.Contract(CLNY.abi as AbiItem[], TESTNET_CLNY);
const mc = new web3.eth.Contract(MC.abi as AbiItem[], TESTNET_NFT);
const gm = new web3.eth.Contract(GM.abi as AbiItem[], TESTNET_GM);

type TokenData = {
  earned: number;
  speed: number;
  baseStation: boolean;
  transport: number;
  robotAssembly: number;
  powerProduction: number;
  lastUpdated: Date;
}

/**
 * This fills allTokens
 */
export const allTokens: Array<number> = [];
(async () => {
  let start = 0;
  while (true) {
    try {
      const data = await mc.methods.allTokensPaginate(start, start + 999).call();
      allTokens.push(...data.map((id) => parseInt(id)));
      start += data.length;
      if (start >= 21000) {
        break;
      }
    } catch { }
    await new Promise((rs) => setTimeout(rs, 10000));
  }
})();


const tokenData: Map<number, TokenData> = new Map();
(async () => {
  const BUNCH_SIZE = 100;
  while (true) {
    await new Promise(rs => setTimeout(rs, 2000));
    if (allTokens.length === 0) {
      continue;
    }
    for (let i = 0; i < allTokens.length; i = i + BUNCH_SIZE) {
      const bunch: Array<number> = [];
      let k = i;
      while (k < Math.min(i + BUNCH_SIZE, allTokens.length)) {
        bunch.push(allTokens[k]);
        k++;
      }
      try {
        const data = await gm.methods.getAttributesMany(bunch).call();
        k = i;
        for (const item of data) {
          const tokenNumber = allTokens[k];
          tokenData.set(tokenNumber, {
            earned: item.earned * 1e-18,
            speed: parseInt(item.speed),
            baseStation: parseInt(item.baseStation) ? true : false,
            transport: parseInt(item.transport),
            robotAssembly: parseInt(item.robotAssembly),
            powerProduction: parseInt(item.powerProduction),
            lastUpdated: new Date(),
          });
          k++;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
})();

export const attribute = (trait_type: string, value: string): Attribute => {
  return {
    trait_type,
    value,
  };
};

export const getData = (token: number): Attribute[] => {
  if (!allTokens.includes(token) || !tokenData.has(token)) {
    return null;
  }

  const tokenAttrs = tokenData.get(token);

  const data: Attribute[] = [
    attribute(
      'Data updated',
      tokenAttrs.lastUpdated.toUTCString(),
    ),
    attribute(
      'Earned CLNY',
      tokenAttrs.earned.toFixed(3),
    ),
    attribute(
      'Earning speed, CLNY/day',
      tokenAttrs.speed.toFixed(1),
    ),
    attribute(
      'Base Station',
      tokenAttrs.baseStation ? 'yes' : 'no',
    ),
    attribute(
      'Transport LVL',
      tokenAttrs.transport.toFixed(0),
    ),
    attribute(
      'Robot Assembly LVL',
      tokenAttrs.robotAssembly.toFixed(0),
    ),
    attribute(
      'Power Production LVL',
      tokenAttrs.powerProduction.toFixed(0),
    ),
  ];
  return data;
};

let cachedSupply = 'Error';
export const getSupply = async (): Promise<string> => {
  try {
    const supply = await clny.methods.totalSupply().call();
    cachedSupply = (supply * 10 ** -18).toFixed(3);
  } catch {
    
  }
  return cachedSupply;
};
