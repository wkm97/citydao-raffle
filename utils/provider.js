import { providers } from "ethers";
import dotenv from 'dotenv'

dotenv.config();

export const provider = new providers.AlchemyProvider("homestead", process.env.ALCHEMY_API);
