import Web3 from 'web3';
import { TESTNET_CLNY, TESTNET_GM, TESTNET_NFT } from '../blockchain/contracts';
import CLNY from '../abi/CLNY.json';
import MC from '../abi/MC.json';
import GM from '../abi/GameManager.json';
import { AbiItem } from 'web3-utils';
import { Attribute, IStorage } from '../types';

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

const tokenData: TokenData[] = new Array(21001); // from 1 to 21000 as tokens go (ignore 0)

let i = 1;
const started = +new Date();
const updaterCycle = async () => {
  i++;
  if (i > 21000) {
    i = 1;
  }
  try {
    const [
      attributes,
    ] = await Promise.all([
      gm.methods.getAttributes(i.toString()).call(),
    ]);
    const baseStation = Boolean(attributes['0'] * 1);
    const transport = attributes['1'] * 1;
    const robotAssembly = attributes['2'] * 1;
    const powerProduction = attributes['3'] * 1;
    const earned = attributes['4'] * 1e-18;
    const speed = attributes['5'] * 1;

    tokenData[i] = {
      earned,
      speed,
      baseStation,
      transport,
      robotAssembly,
      powerProduction,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.log(error.message);
  }

  await new Promise((rs) => setTimeout(rs, 250));
  console.log((+new Date() - started) / i);
};

const startCycle = async () => {
  while (true) {
    await updaterCycle();
  }
};

// startCycle();
// startCycle();
// startCycle();

const storage: IStorage = {
  earned: new Map(),
  speed: new Map(),
  hasBaseStation: new Map(),
  transport: new Map(),
  robotAssembly: new Map(),
  powerProduction: new Map(),
  lastUpdated: new Map(),
};

const MINUTE = 60;

export const attribute = (trait_type: string, value: string): Attribute => {
  return {
    trait_type,
    value,
  };
};


const TRIES = 3;
export const getData = async (token: number, nextTry = TRIES): Promise<Attribute[] | null> => {
  const lastUpdated = storage.lastUpdated.get(token);
  if (
    nextTry > 0 &&
    (
      !lastUpdated
      || +new Date() / 1000 - +lastUpdated / 1000 > 60 * MINUTE
    )
  ) {
    try {
      await mc.methods.ownerOf(token.toString()).call(); // can revert
      const [
        earned,
        speed,
        enhancements,
      ] = await Promise.all([
        gm.methods.getEarned(token.toString()).call(),
        gm.methods.getEarningSpeed(token.toString()).call(),
        gm.methods.getEnhancements(token.toString()).call(),
      ]);
      const [hasBaseStation, transport, robotAssembly, powerProduction] = enhancements;
      storage.earned.set(token, parseInt(earned)  * 1e-18);
      storage.speed.set(token, parseInt(speed));
      storage.hasBaseStation.set(token, Boolean(parseInt(hasBaseStation)));
      storage.transport.set(token, parseInt(transport));
      storage.robotAssembly.set(token, parseInt(robotAssembly));
      storage.powerProduction.set(token, parseInt(powerProduction));
      storage.lastUpdated.set(token, new Date());
    } catch {
      return getData(token, nextTry--); // return old data in case of any error
    }
  }
  // after error recursion
  if (!storage.lastUpdated.has(token)) {
    return null;
  }
  const data: Attribute[] = [
    attribute(
      'Data updated',
      (storage.lastUpdated.get(token) ?? new Date(0)).toUTCString(),
    ),
    attribute(
      'Earned CLNY',
      (storage.earned.get(token) ?? -1).toFixed(3),
    ),
    attribute(
      'Earning speed, CLNY/day',
      (storage.speed.get(token) ?? -1).toFixed(1),
    ),
    attribute(
      'Base Station',
      storage.hasBaseStation.get(token) ? 'yes' : 'no',
    ),
    attribute(
      'Transport LVL',
      (storage.transport.get(token) ?? -1).toFixed(0),
    ),
    attribute(
      'Robot Assembly LVL',
      (storage.robotAssembly.get(token) ?? -1).toFixed(0),
    ),
    attribute(
      'Power Production LVL',
      (storage.powerProduction.get(token) ?? -1).toFixed(0),
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

export const tokens = new Set<number>();
// every token is minted
for (let i = 1; i <= 21000; i++) {
  tokens.add(i);
}
// TODO rewrite for launches on another chains
// (async () => {
//   //preload
//   for (let i = 0; i < 90; i++) {
//     try {
//       const data = await mc.methods.allTokensPaginate(i * 200, i * 200 + 200).call();
//       data.forEach(item => tokens.add(+item));
//     } catch {}
//   }
  
//   while (true) {
//     for (let token = 1; token <= 21000; token++) {
//       if (tokens.has(token)) {
//         continue;
//       }
//       try {
//         await mc.methods.ownerOf(token.toString()).call();
//         tokens.add(token);
//       } catch {

//       }
//       await new Promise(rs => setTimeout(rs, 100));
//     }
//     await new Promise(rs => setTimeout(rs, 500));
//   }
// })();
