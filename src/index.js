/**
 * Entry point
 * @author Basile Pesin
 */

var graphql = require('./graphql.js')
var config = require('./config.js')
var leaderboard = require('./leaderboard.js')

graphql.client.connect(config.token)

$(function() {
    var contestants
    $.ajax({
        url: './contestants.txt',
        success: (result) => {
            contestants = result.split('\n').filter(login => login.length > 0)
        },
        async: false
    })

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
        let users = number_of_repos(data)
        leaderboard.generate(users)
    })
})

/**
 * Count the number of repos created between startTime and endTime for each user
 * @param users list returned by the graphql query
 * @param startTime only count repos after this time
 * @param endTime only count repos before this time
 * @return user list enriched with the count of valid repos
 */
function number_of_repos(users, startTime=(new Date(0)), endTime=(new Date())) {
    for(var key in users) {
        console.log(users[key])
        users[key]['repo_count'] = users[key]['repositories']['nodes'].filter(repo => {
            let createdAt = new Date(repo['createdAt'])
            return (createdAt > startTime && createdAt < endTime)
        }).length
    }
    return users
}
