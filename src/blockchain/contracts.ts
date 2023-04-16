import Web3 from "web3";
import { CONTRACTS } from "./contracts-addresses";
import CLNY from "../abi/CLNY.json";
import MC from "../abi/MC.json";
import GM from "../abi/GameManager.json";
import LANDSTATS from "../abi/LandStats.json";
import { AbiItem } from "web3-utils";
import { ALCHEMY_KEY } from "../secrets";
import { environment } from "../environment";

const nodeMap = {
  hartest: ["https://api.s0.b.hmny.io"],
  harmain: [
    "https://a.api.s0.t.hmny.io",
    "https://api.harmony.one",
    "https://api.s0.t.hmny.io",
  ],
  mumbai: ["https://polygon-mumbai.g.alchemy.com/v2/" + ALCHEMY_KEY],
  polygon: [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.matic.network",
    "https://matic-mainnet-archive-rpc.bwarelabs.com",
    "https://rpc.ankr.com/polygon",
  ],
  fuji: ["https://api.avax-test.network/ext/bc/C/rpc"],
};

const nodes = nodeMap[environment.NETWORK];

const web3 = new Web3(nodeMap[environment.NETWORK][0]);

export const clny = new web3.eth.Contract(
  CLNY.abi as AbiItem[],
  CONTRACTS.CLNY
);
export const mc = new web3.eth.Contract(MC.abi as AbiItem[], CONTRACTS.MC);
export const gm = new web3.eth.Contract(GM as AbiItem[], CONTRACTS.GM);
export const gms = nodes.map(
  (node) => new new Web3(node).eth.Contract(GM as AbiItem[], CONTRACTS.GM)
);
export const anyGm = () => gms[Math.floor(Math.random() * gms.length)];
export const ls = new web3.eth.Contract(
  LANDSTATS.abi as AbiItem[],
  CONTRACTS.LANDSTATS
);
