const NETWORK_DATA: Record<string, {
  CLNY: string;
  MC: string;
  GM: string;
  shares: boolean;
  meta: string;
}> = {
  hartest: {
    CLNY: '0x6b1a8FED67401fE9Ed5B4736Bc94D6Fb9F42CC46',
    MC: '0xc268D8b64ce7DB6Eb8C29562Ae538005Fded299A',
    GM: '0xc65F8BA708814653EDdCe0e9f75827fe309E29aD',
    shares: false,
    meta: 'https://meta.marscolony.io/',
  },
  harmain: {
    CLNY: '0x0D625029E21540aBdfAFa3BFC6FD44fB4e0A66d0',
    MC: '0x0bC0cdFDd36fc411C83221A348230Da5D3DfA89e',
    GM: '0x0D112a449D23961d03E906572D8ce861C441D6c3',
    shares: false,
    meta: 'https://meta.marscolony.io/',
  },
  polygon: {
    CLNY: '0x73E6432Ec675536BBC6825E16F1D427be44B9639',
    MC: '0xb5D95034171733F3D636B49e5f4703d7d906b1a4',
    GM: '0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797',
    shares: true,
    meta: 'https://meta-polygon.marscolony.io/',
  },
  mumbai: {
    CLNY: '0x73E6432Ec675536BBC6825E16F1D427be44B9639',
    MC: '0xBF5C3027992690d752be3e764a4B61Fc6910A5c0',
    GM: '0xCAFAeD55fEfEd74Ca866fE72D65CfF073eb42797',
    shares: true,
    meta: 'https://meta-mumbai.marscolony.io/',
  },
  fuji: {
    CLNY: '0xC6C5b8a181Bbb8AB5cB88dBF424892ee278f6BBc',
    MC: '0x031D6A8eD3d5ad28b026FF2098Fc2a1d0DB9DcF2',
    GM: '0x0Dd5dDaC089613F736e89F81E16361b09c7d53C6',
    shares: false,
    meta: 'https://meta-fuji.marscolony.io/',
  },
};

export const CONTRACTS = NETWORK_DATA[process.env.NETWORK];
