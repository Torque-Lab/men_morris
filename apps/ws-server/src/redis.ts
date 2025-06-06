import { createClient,RedisClientType } from "redis";

type RedisType = RedisClientType<any, any, any>;

export const pub: RedisType = createClient();
export const sub: RedisType = createClient();

async function initPub() {
  await pub.connect();
}

async function initSub() {
  await sub.connect();
}

initPub();
initSub();
