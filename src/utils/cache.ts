import NodeCache from "node-cache";



export const localCache = new NodeCache();

// cache variables name and function
export const cacheVariables = {
  otp: "OTP-CODE",
};

export const setLocalCache = (key: string, value: any) => {
  localCache.set(key, value);
};

export const getLocalCache = (key: string) => {
  return localCache.get(key);
};

export const deleteLocalCache = (key: string | string[]) => {
  localCache.del(key);
};

export const existsLocalCache = (key: string) => {
  return localCache.has(key);
};

export const clearLocalCache = () => {
  localCache.flushAll();
};

