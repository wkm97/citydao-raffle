import { getEthAddressByEns } from './ens-service.js'
import { nftOwned } from './nft-service.js'
import { isVoteExists } from './snapshot-service.js'
import ethers from "ethers";

export const toValidAddress = async (candidate) => {
    if (ethers.utils.isAddress(candidate)) {
        return candidate
    }
    return getEthAddressByEns(candidate)
}

export const isWinner = async (address) => {
    if (!await isVoteExists(address)) {
        return {status: false, reason: 'has not voted in a snapshot'};
    }
    if (await nftOwned(address) < 1) {
        return {status: false, reason: 'does not own a Citizen NFT'};
    }
    return {status: true, reason: 'winner'};
}

export async function raffle(candidates, totalWinners = 125){
    const uniqAddresses = [...new Set(candidates)];
    const winners = [];
    while (winners.length < totalWinners && uniqAddresses.length > 0) {
        const randomIdx = Math.floor(Math.random() * uniqAddresses.length)
        const candidate = uniqAddresses[randomIdx];
        try {
            const candidateAddress = await toValidAddress(candidate);
            const {status: isCandidateWinner, reason} = await isWinner(candidateAddress);
            if (isCandidateWinner) {
                winners.push(candidate);
                console.log('Winner:', candidate)
            } else {
                console.log(`Invalid Entry: ${candidate} ${reason}`)
            }
        }catch(e){
            console.log(`Invalid Entry: ${candidate} ${e.message}`)
        }
        uniqAddresses.splice(randomIdx, 1);
    }
    return winners
}