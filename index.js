import { getEthAddressByEns } from './utils/ens-service.js'
import { balanceOf } from './utils/nft-service.js'
import { isVoteExists } from './utils/snapshot-service.js'
import { parse } from 'csv-parse/sync';
import ethers from "ethers";
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config();

const TOTAL_WINNERS = 5
const OUTPUT_PATH = 'output.tmp.csv'

const toValidAddress = async (candidate) => {
    if (ethers.utils.isAddress(candidate)) {
        return candidate
    }
    return getEthAddressByEns(candidate)
}

const isWinner = async (address) => {
    // console.log(isVoteExists(address))
    if (!await isVoteExists(address)) {
        return false;
    }
    if (await balanceOf(address) < 1) {
        return false;
    }
    return true;
}

async function main() {
    const content = fs.readFileSync("./input.csv")
    const allAddresses = parse(content, { delimiter: ",", from_line: 2 }).map(record => record[0])
    const uniqAddresses = [...new Set(allAddresses)];
    const winners = [];
    while (winners.length < TOTAL_WINNERS) {
        const randomIdx = Math.floor(Math.random() * uniqAddresses.length)
        const candidate = uniqAddresses[randomIdx];
        try {
            const candidateAddress = await toValidAddress(candidate);
            const isCandidateWinner = await isWinner(candidateAddress);
            if (isCandidateWinner) {
                winners.push(candidate);
                console.log('Winner:', candidate)
            } else {
                console.log('No Condition:', candidate)
            }
        }catch(e){
            console.error(e)
        }
        uniqAddresses.splice(randomIdx, 1);
    }
    fs.writeFileSync(OUTPUT_PATH, winners.join('\n'))
};

main()
