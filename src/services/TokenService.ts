import { anyGm, clny, gm, mc } from "../blockchain/contracts";
import { CONTRACTS } from "../blockchain/contracts-addresses";
import { Attribute } from "../types";

type TokenData = {
  earned: number;
  speed: number;
  baseStation: boolean;
  transport: number;
  robotAssembly: number;
  powerProduction: number;
  lastUpdated: Date;
};

/**
 * This fills allTokens
 */
export const allTokens: Array<number> = [];
(async () => {
  let start = 0;
  while (true) {
    try {
      const data = await mc.methods
        .allTokensPaginate(start, start + 999)
        .call();
      allTokens.push(...data.map((id: string) => parseInt(id)));
      start += data.length;
      if (start >= 21000) {
        break;
      }
    } catch (error: any) {
      console.log("paginate", error.message);
    }
    await new Promise((rs) => setTimeout(rs, 1000));
  }
})();

const tokenData: Map<number, TokenData> = new Map();
(async () => {
  const BUNCH_SIZE = 500;
  while (true) {
    await new Promise((rs) => setTimeout(rs, 5000));
    if (allTokens.length === 0) {
      continue;
    }
    let i = 0;
    while (i < allTokens.length) {
      await new Promise((rs) => setTimeout(rs, 2000));
      const bunch: Array<number> = [];
      let k = i;
      while (k < Math.min(i + BUNCH_SIZE, allTokens.length)) {
        bunch.push(allTokens[k]);
        k++;
      }
      try {
        const data = await anyGm().methods.getAttributesMany(bunch).call();
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
        console.log("ok", i);
        i = i + BUNCH_SIZE;
      } catch (error: any) {
        console.log("data", error.message);
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

export const getData = async (token: number): Promise<Attribute[] | null> => {
  if (!allTokens.includes(token) || !tokenData.has(token)) {
    try {
      const data = await gm.methods.getAttributesMany([token]).call();
      console.log("WITHOUT CACHE", token);
      const item = data[0];
      tokenData.set(token, {
        earned: item.earned * 1e-18,
        speed: parseInt(item.speed),
        baseStation: parseInt(item.baseStation) ? true : false,
        transport: parseInt(item.transport),
        robotAssembly: parseInt(item.robotAssembly),
        powerProduction: parseInt(item.powerProduction),
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  const tokenAttrs = tokenData.get(token)!;

  const data: Attribute[] = [
    attribute("Data updated", tokenAttrs.lastUpdated.toUTCString()),
    attribute("Earned CLNY", tokenAttrs.earned.toFixed(3)),
    attribute(
      CONTRACTS.shares ? "Shares" : "Earning speed, CLNY/day",
      tokenAttrs.speed.toFixed(CONTRACTS.shares ? 0 : 1)
    ),
    attribute("Base Station", tokenAttrs.baseStation ? "yes" : "no"),
    attribute("Transport LVL", tokenAttrs.transport.toFixed(0)),
    attribute("Robot Assembly LVL", tokenAttrs.robotAssembly.toFixed(0)),
    attribute("Power Production LVL", tokenAttrs.powerProduction.toFixed(0)),
  ];
  return data;
};

let cachedSupply = "Error";
let cachedCirculatingSupply = "Error";
export const getSupply = async (): Promise<string> => {
  try {
    const supply = await clny.methods.totalSupply().call();
    cachedSupply = (supply * 10 ** -18).toFixed(3);
  } catch {}
  return cachedSupply;
};

export const getCirculatingSupply = async (): Promise<string> => {
  try {
    const totalSupply = await clny.methods.totalSupply().call();
    
    let lockedSupply = 0;
    for (const address of CONTRACTS.excludeFromSupply) {
      const balance = await clny.methods.balanceOf(address).call();
      lockedSupply = lockedSupply + balance * 1e-18;
    }

    cachedCirculatingSupply = (totalSupply * 1e-18 - lockedSupply).toFixed(3);
  } catch {}
  return cachedCirculatingSupply;
};

type Metrics = {
  available: number;
  claimed: number;
};

(async () => {
  while (true) {
    try {
      const metrics = await gm.methods.saleData().call();

      cachedMetrics = {
        available: metrics.limit - metrics.minted,
        claimed: parseInt(metrics.minted),
      };
    } catch {}

    await new Promise((rs) => setTimeout(rs, 10_000));
  }
})();
let cachedMetrics: Metrics | null = null;
export const getMetrics = (): Metrics => {
  return (
    cachedMetrics ?? {
      available: 0,
      claimed: 0,
    }
  );
};
