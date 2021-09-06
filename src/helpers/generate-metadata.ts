export const generateMetadata = (token: number): Record<string, string | Record<string, any>> => {
  return {
    name: `MarsColony Land Plot #${token}`,
    description: `MarsColony Land Plot #${token}`,
    image: `https://meta.marscolony.io/${token}.png`,
  };
};
