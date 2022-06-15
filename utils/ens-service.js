import pkg from '@apollo/client/core/core.cjs';
import fetch from 'cross-fetch';
const { ApolloClient, gql, HttpLink, InMemoryCache } = pkg;

const APIURL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

const ensClient = new ApolloClient({
    link: new HttpLink({ uri: APIURL, fetch }),
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