import { v4 } from "uuid";
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: string) => {
    const token = v4();
    await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24);

    return `https://chat.sandtee.tk/user/confirm/${token}`;
}