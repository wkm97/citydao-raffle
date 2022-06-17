import fetch from 'cross-fetch';
import client from '@apollo/client/core/core.cjs';
import retry from '@apollo/client/link/retry/retry.cjs';
const { ApolloClient, from, gql, HttpLink, InMemoryCache } = client;
const { RetryLink } = retry;

const APIURL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

const link = from([
    new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 8,
            retryIf: (error, _operation) => !!error
        }
    }),
    new HttpLink({ uri: APIURL, fetch })
])

const ensClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
})

export const getAddressByEns = async (ensAddress) => {
    if (!ensAddress || !ensAddress.toLowerCase().includes('.eth')) {
        throw new Error('wrong ens address format');
    }
    const query = `
        {
        domains(first: 1, where:{name:"${ensAddress}"}) {
            name
            labelName
                owner {
                    id
                }
            }
        }      
    `
    const { data } = await ensClient.query({
        query: gql(query),
    })
    if(data.domains.length < 1){
        throw new Error('no ens domain found')
    }
    return data.domains[0].owner.id
}