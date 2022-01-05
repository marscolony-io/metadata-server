import Web3 from 'web3';
import { TESTNET_CLNY, TESTNET_GM, TESTNET_NFT } from '../blockchain/contracts';
// import CLNY from '../blockchain/CLNY.json';
import MC from '../blockchain/MC.json';
import GM from '../blockchain/GameManager.json';
import { AbiItem } from 'web3-utils';
import { Attribute, IStorage } from '../types';

const web3 = new Web3(
  process.env.TESTNET
    ? 'https://api.s0.b.hmny.io'
    : 'https://api.harmony.one',
);

// const clny = new web3.eth.Contract(CLNY.abi as AbiItem[], TESTNET_CLNY);
const mc = new web3.eth.Contract(MC.abi as AbiItem[], TESTNET_NFT);
const gm = new web3.eth.Contract(GM.abi as AbiItem[], TESTNET_GM);

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

export const getData = async (token: number, nextTry = false): Promise<Attribute[] | null> => {
  const lastUpdated = storage.lastUpdated.get(token);
  if (
    !nextTry &&
    (
      !lastUpdated
      || +new Date() / 1000 - +lastUpdated / 1000 > MINUTE
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
    } catch () {
      return getData(token, true); // return old data in case of any error
    }
  }
  if (!storage.lastUpdated.has(token)) {
    return null;
  }
  return [
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
};
