/**
 * Graphql client
 * @module graphql
 * @author Basile Pesin
 */

var graphql = require('graphql-request')

/**
 * Client class, encapsulates a GraphQLClient
 */
class Client {
    static connect (token) {
        Client.client = new graphql.GraphQLClient('https://api.github.com/graphql', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    }

    static request (query) {
        if (Client.client == null) return 'Graphql client has not been started'
        return Client.client.request(query)
    }
}

Client.client = null

module.exports = {
    client: Client
}
