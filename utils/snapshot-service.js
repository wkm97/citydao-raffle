import pkg from '@apollo/client/core/core.cjs';
import fetch from 'cross-fetch';
const { ApolloClient, gql, HttpLink, InMemoryCache } = pkg;

const APIURL = 'https://hub.snapshot.org/graphql'

const snapshotClient = new ApolloClient({
    link: new HttpLink({ uri: APIURL, fetch }),
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