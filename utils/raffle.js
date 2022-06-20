import { getAddressByEns } from './ens-service.js'
import { nftOwned } from './nft-service.js'
import { isVoteExists } from './snapshot-service.js'
import ethers from "ethers";

export const toValidAddress = async (candidate) => {
    if (ethers.utils.isAddress(candidate)) {
        return candidate
    }
    return getAddressByEns(candidate)
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

export const buildUniqueCandidates = async (rawData) => {
    const sanitizedRawData = rawData.map(item=>item.toLowerCase().trim());
    const uniqueData = [...new Set(sanitizedRawData)];
    const candidateSet = new Set();
    const ensMapper = {};
    for(const candidate of uniqueData){
        try {
            const candidateAddress = (await toValidAddress(candidate)).toLowerCase(); // standardize all to lowercase because subgraph ens return address with lower case
            candidateSet.add(candidateAddress);
            if(candidateAddress !== candidate.toLowerCase()){
                ensMapper[candidateAddress] = candidate;
            }
        }catch(e){
            console.log(`Invalid Entry: ${candidate} ${e.message}`)
        }
    }
    const uniqueCandidates = [...candidateSet];
    return {uniqueCandidates, ensMapper}
}

export async function raffle(candidates, totalWinners = 125){
    const {uniqueCandidates, ensMapper} = await buildUniqueCandidates(candidates);
    const winners = [];
    while (winners.length < totalWinners && uniqueCandidates.length > 0) {
        const randomIdx = Math.floor(Math.random() * uniqueCandidates.length)
        const candidateAddress = uniqueCandidates[randomIdx];
        const {status: isCandidateWinner, reason} = await isWinner(candidateAddress);
        const inputAddress = ensMapper.hasOwnProperty(candidateAddress) ? ensMapper[candidateAddress]: candidateAddress
        if (isCandidateWinner) {
            winners.push(inputAddress);
            console.log('Winner:', inputAddress)
        } else {
            console.log(`Invalid Entry: ${inputAddress} ${reason}`)
        }
        uniqueCandidates.splice(randomIdx, 1);
    }
    return winners
}