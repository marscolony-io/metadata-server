import { environment } from "../environment";
const NETWORK_DATA: Record<
  string,
  {
    CLNY: string;
    MC: string;
    GM: string;
    LANDSTATS: string;
    shares: boolean;
    meta: string;
    excludeFromSupply: string[]; // addresses for excluding to make circulating supply
  }
> = {
  harmain: {
    CLNY: "0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0",
    MC: "0x0bC0cdFDd36fc411C83221A348230Da5D3DfA89e",
    GM: "0x0D112a449D23961d03E906572D8ce861C441D6c3",
    LANDSTATS: "",
    shares: false,
    meta: "https://meta.marscolony.io/",
    excludeFromSupply: [],
  },
  polygon: {
    CLNY: "0xCEBaF32BBF205aDB2BcC5d2a5A5DAd91b83Ba424",
    MC: "0x3B45B2AEc65A4492B7bd3aAd7d9Fa8f82B79D4d0",
    GM: "0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797",
    LANDSTATS: "0xf8C9a745188FC9E7aE05E69Dc5C672647d43d073",
    shares: true,
    meta: "https://meta-polygon.marscolony.io/",
    excludeFromSupply: [
      '0x42f9f020afe1b2a9554ad6c0749447519692f630', // treasury
      '0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797', // gamemanager - buffer for claiming
      '0x97F8027E5BbcE64200B65c5cF675fCED587eF0e8', // liquidity for mining
      // '0x0319000133d3ada02600f0875d2cf03d442c3367', // liquidity in sushiswap
    ],
  },
  mumbai: {
    CLNY: "0x73E6432Ec675536BBC6825E16F1D427be44B9639",
    MC: "0xBF5C3027992690d752be3e764a4B61Fc6910A5c0",
    GM: "0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797",
    LANDSTATS: "0x3bB9c59f48F40C9bC37Ec11bE1ad138c8d1C3ECb",
    shares: true,
    meta: "https://meta-mumbai.marscolony.io/",
    excludeFromSupply: [],
  },
  fuji: {
    CLNY: "0xC6C5b8a181Bbb8AB5cB88dBF424892ee278f6BBc",
    MC: "0x031D6A8eD3d5ad28b026FF2098Fc2a1d0DB9DcF2",
    GM: "0x0Dd5dDaC089613F736e89F81E16361b09c7d53C6",
    LANDSTATS: "",
    shares: false,
    meta: "https://meta-fuji.marscolony.io/",
    excludeFromSupply: [],
  },
};

export const CONTRACTS = NETWORK_DATA[environment.NETWORK];
