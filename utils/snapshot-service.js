import fetch from 'cross-fetch';
import client from '@apollo/client/core/core.cjs';
import retry from '@apollo/client/link/retry/retry.cjs';
const { ApolloClient, from, gql, HttpLink, InMemoryCache } = client;
const { RetryLink } = retry;

const APIURL = 'https://hub.snapshot.org/graphql'

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

const snapshotClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
})

export const isVoteExists = async (address) => {
    if (!address) {
        throw new Error('no address');
    }
    const query = `
        {
            votes(where:{space:"daocity.eth", voter:"${address}"}, first: 1){
                voter
                proposal {
                  id
                  choices
                }
                choice
              }
        }      
    `
    const { data } = await snapshotClient.query({
        query: gql(query),
    })
    return data.votes.length > 0? true : false;
}