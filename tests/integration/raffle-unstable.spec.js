// Test cases with address that might transfer the nft and break the test cases.

import { raffle } from '../../utils/raffle.js';
import assert from 'assert';

const invalidCandidates = ['0x4fc9334d3d78f6f3d7b173d66b0437d225edc3e3', '0x88dafbe57f9e8379dd611cd4fef01d300834c010', 'somerandomstring', 'something.eth', 'invalid.eth'];

describe('raffle', ()=>{
    const validRuns = [
        // citizen
        {candidates: ['feelslike.eth', 'andreiluca.eth', '0x058d968e6a424F72DF07269729f4b8065D213c70','0xede8d0b12d74a32a50fcefc4601527843dcce345'], description: 'citizen with vote'}, 
        // founding citizen
        {candidates: ['scofi.eth', 'communitys.eth', 'yiction.eth', '0x57c2cdfe81512f272d5994565e21cb6b5ad4d921'], description: 'founding citizen with vote'}, 
    ];

    validRuns.forEach((run)=>{
        it(`valid case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates, ...invalidCandidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, run.candidates.length); // all sample will be valid
        })
    })

    const invalidRuns = [
        // not owning any citizen
        {candidates: ['0xc5a61d56ca395fcb87f148532369595e31286d0e', '0x86824c15b825c60bf920f076e8820ebd2ef8c7ad'], description: 'without any nft'},
        // no vote but with citizen nft
        {candidates: ['nathcohen.eth', 'binance30.eth', 'apadova.eth', '0x1993d075bb97F0Fe245cD3eA1694bee068466e09', '0x2Ae6332E4a51B499632683279752Effffa5F157F'], description: 'without vote but with citizen nft'}, 
        // no vote but with founding citizen
        {candidates: ['0x60e7343205C9C88788a22C40030d35f9370d302D', '0xd576cceD4648d3Fe5e0276c0E698D0d900977A1B', '0xc9F2Fbe0899dEFc450203CEF2Fd05713E250CB48', 'gallery.dfmerin.eth', 'space-lord.eth'], description: 'without vote but with founding citizen'}, 
        // first citizen but not voted
        {candidates: ['0xaDB2666f2d9d7A247626925315Da9B54bB34Db7D'], description: 'without vote but with first citizen'} 
    ]
    invalidRuns.forEach((run)=>{
        it(`invalid case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, 0); // All invalid candidate, no winners
        })
    })

    const duplicateRuns = [
        {candidates: ['feelslike.eth', 'feelslike.eth'], description: 'duplicated ens address'},
        {candidates: ['0x058d968e6a424F72DF07269729f4b8065D213c70', '0x058d968e6a424F72DF07269729f4b8065D213c70'], description: 'duplicated x0 address'},
        {candidates: ['feelslike.eth', '0xF19F62F44e61bF9913AFeAde70eeb14B78Bc6Df8', 'hellowold.www'], description: 'duplicated ens and x0 address'},
    ];

    duplicateRuns.forEach((run)=>{
        it(`duplicate case: ${run.description}`, async()=>{
            const allCandidates = [...run.candidates];
            const results = await raffle(allCandidates);
            assert.equal(results.length, 1);
        })
    })
})