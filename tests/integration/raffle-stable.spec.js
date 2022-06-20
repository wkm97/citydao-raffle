// Test cases with facilitators address that most likely to hold the nft.

import { raffle } from '../../utils/raffle.js';
import assert from 'assert';

const invalidCandidates = ['0x4fc9334d3d78f6f3d7b173d66b0437d225edc3e3', '0x88dafbe57f9e8379dd611cd4fef01d300834c010', 'somerandomstring', 'something.eth', 'invalid.eth'];

describe('raffle', ()=>{
    const validRuns = [
        // citizen
        {candidates: ['0x6bd9A24447b4a6d401749113B75B3b74e02f5132', 'favian.eth'], description: 'citizen with vote'},
        // test address with whitespace
        {candidates: ['   0x6bd9A24447b4a6d401749113B75B3b74e02f5132  ', '  favian.eth   '], description: 'valid address with whitespace'},
        // test ens address with capitalized letter
        {candidates: ['MemeBrains.eth', 'Favian.eth'], description: 'address with capitalized letter'},
    ];

    validRuns.forEach((run)=>{
        it(`valid case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates, ...invalidCandidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, run.candidates.length); // all sample will be valid
        })
    })

    const invalidRuns = [
        {candidates: ['0x60e7343205c9c88788a22c40030d35f9370d302d'], description: 'without vote but with founding citizen'}
    ]
    invalidRuns.forEach((run)=>{
        it(`invalid case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, 0); // All invalid candidate, no winners
        })
    })

    const duplicateRuns = [
        {candidates: ['favian.eth', 'favian.eth'], description: 'duplicated ens address'},
        {candidates: ['0x6bd9A24447b4a6d401749113B75B3b74e02f5132', '0x6bd9A24447b4a6d401749113B75B3b74e02f5132'], description: 'duplicated x0 address'},
        {candidates: ['favian.eth', '0xafa46468De1D6f1ab77DEFAe5F7657467911182d', 'hellowold.www'], description: 'duplicated ens and x0 address'},
    ];

    duplicateRuns.forEach((run)=>{
        it(`duplicate case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, 1);
        })
    })
})