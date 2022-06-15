import { getDefaultProvider } from "ethers";
import dotenv from 'dotenv'

dotenv.config();

export const provider = new getDefaultProvider("homestead", {
    alchemy: process.env.ALCHEMY_API,
});