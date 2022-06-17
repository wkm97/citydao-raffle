# Raffle

## Main usage
Run raffle by
```bash
export ALCHEMY_API=some-alchemy-api-key
node index.js
```

## Run test
```bash
export ALCHEMY_API=some-alchemy-api-key

# Stable test: Test cases with facilitators address that most likely to hold the nft.
npm run test:integration

# Unstable test: Test cases with address that might transfer the nft and break the test cases.
npm run test:integration-unstable
```

## Input file
- Remark: it will skip the first row which is header, make sure first row is not address nor ens.
- Can refer to `input.csv` for example