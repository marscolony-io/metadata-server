import { ls } from "../blockchain/contracts";

type StatData = {
  burned: number;
  minted: number;
  avg: number;
  max: number;
};

const getStatFromContract = async (): Promise<StatData | null> => {
  try {
    const data = await ls.methods.gelClnyStat().call();
    return {
      minted: data.minted,
      burned: data.burned,
      avg: data.avg,
      max: data.max,
    };
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

let cachedStatData: StatData | null = null;

(async () => {
  while (true) {
    try {
      cachedStatData = await getStatFromContract();
      // console.log("cachedStatData set", cachedStatData);
    } catch (error: any) {
      console.log("getStatFromContract error", error.message);
    }
    await new Promise((rs) => setTimeout(rs, 10000));
  }
})();

export const getLandStatCachedData = (): StatData => {
  return (
    cachedStatData ?? {
      minted: 0,
      burned: 0,
      avg: 0,
      max: 0,
    }
  );
};
