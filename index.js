import { parse } from 'csv-parse/sync';
import fs from 'fs'
import {raffle} from './utils/raffle.js';

const TOTAL_WINNERS = 10; // test upload with low number

async function main() {
    const content = fs.readFileSync("./input.csv")
    const allAddresses = parse(content, { delimiter: ",", from_line: 2 }).map(record => record[0])
    const winners = await raffle(allAddresses, TOTAL_WINNERS);
    fs.writeFileSync(OUTPUT_PATH, winners.join('\n'))
}

main()
