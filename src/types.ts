export type Attribute = {
  trait_type: string;
  value: string;
};

export interface IStorage {
  earned: Map<number, number>;
  speed: Map<number, number>;
  hasBaseStation: Map<number, boolean>;
  robotAssembly: Map<number, number>;
  transport: Map<number, number>;
  powerProduction: Map<number, number>;
  lastUpdated: Map<number, Date>;
};
