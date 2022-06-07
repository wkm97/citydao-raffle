import { getDefaultProvider, Contract } from "ethers";
import fs from 'fs';

const abiPath = './abi/nft-abi.json';
const abi = JSON.parse(fs.readFileSync(abiPath))

export const provider = new getDefaultProvider("homestead", {
    alchemy: process.env.ALCHEMY_API,
});
const NFTAddress = "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb"
const tokenType = 42 // Citizen NFT


export const balanceOf = async(owner) => {
    const contract = new Contract(NFTAddress, abi, provider);
    const data = await contract.balanceOf(owner, tokenType);
    return Number(data)
}