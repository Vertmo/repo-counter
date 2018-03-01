/**
 * Entry point
 * @author Basile Pesin
 */

var graphql = require('./graphql.js')
var config = require('./config.js')
var leaderboard = require('./leaderboard.js')

graphql.client.connect(config.token)

var contestants = ["Vertmo", "Ninored", "joenash", "keyber"]

$(function() {
    var query = `fragment userFields on User {
        login
        avatarUrl
        resourcePath
        repositories(last:100, orderBy: {field: CREATED_AT, direction:DESC}, privacy:PUBLIC, affiliations:[OWNER]) {
            nodes {
                createdAt
            }
        }
    }`

    query += '{' 
    for(var i=0; i < contestants.length; i++) {
        query += 'user' + i + ': user(login: "' + contestants[i] + '") {...userFields}'
    }
    query += '}'

    graphql.client.request(query).then(data => {
        leaderboard.generate(data)
    })
})
