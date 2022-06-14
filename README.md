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
npm run test:integration
```

## Input file
- Remark: it will skip the first row which is header, make sure first row is not address nor ens.
- Can refer to `input.csv` for example