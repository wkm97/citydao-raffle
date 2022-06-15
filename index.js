#!/usr/bin/env node

import { parse } from 'csv-parse/sync';
import fs from 'fs'
import { raffle } from './utils/raffle.js';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));


(async () => {
    const argv = await yargs
        .option('input', { type: 'string', require: true, default: "input.csv"})
        .option('output', { type: 'string', require: true, default: "output.csv" })
        .option('winners', { type: 'number', require: false, default: 125})
        .alias('i', 'input')
        .alias('o', 'output')
        .alias('w', 'winners')
        .argv;

    console.log(`Start raffle from ${argv.input}, total winner: ${argv.winners}`)
    const content = fs.readFileSync(argv.input)
    const allAddresses = parse(content, { delimiter: ",", from_line: 2 }).map(record => record[0])
    const winners = await raffle(allAddresses, argv.winners);
    fs.writeFileSync(argv.output, winners.join('\n'))
})();