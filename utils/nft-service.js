import { getDefaultProvider, Contract } from "ethers";
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();

const abiPath = './abi/nft-abi.json';
const abi = JSON.parse(fs.readFileSync(abiPath))

export const provider = new getDefaultProvider("homestead", {
    alchemy: process.env.ALCHEMY_API,
});
const NFTAddress = "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb"


export const nftOwned = async(owner) => {
    const addresses = [owner, owner, owner];
    const tokenTypes = [42, 69, 7];
    const contract = new Contract(NFTAddress, abi, provider);
    const data = await contract.balanceOfBatch(addresses, tokenTypes);
    return data.reduce((prev, curr)=>{
        const num = Number(curr);
        return prev + num
    }, 0)
}