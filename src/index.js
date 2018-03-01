/**
 * Entry point
 * @author Basile Pesin
 */

var graphql = require('./graphql.js')
var config = require('./config.js')
var leaderboard = require('./leaderboard.js')

graphql.client.connect(config.token)

$(function() {
    // Set the time pickers
    $('#startTimePicker').timepicker({ 'timeFormat': 'H:i' }).timepicker('setTime', new Date())
    $('#endTimePicker').timepicker({ 'timeFormat': 'H:i' }).timepicker('setTime', new Date())

    $('#startTimePicker').change(() => {
        refresh_query()
    })

    $('#endTimePicker').change(() => {
        refresh_query()
    })

    refresh_query()
})

/**
 * Send the query and apply all the changes, generally called on a timeout or after form change
 */
function refresh_query() {
    var contestants
    $.ajax({
        url: './contestants.txt',
        success: (result) => {
            contestants = result.split('\n').filter(login => login.length > 0)
        },
        async: false
    })

    let query = `fragment userFields on User {
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
        // Setting the time is kind of a mess
        let startString = $('#startTimePicker').val().split(':')
        let endString = $('#endTimePicker').val().split(':')
        let startTime = new Date()
        startTime.setHours(parseInt(startString[0]))
        startTime.setMinutes(parseInt(startString[1]))
        let endTime = new Date()
        endTime.setHours(parseInt(endString[0]))
        endTime.setMinutes(parseInt(endString[1]))

        let users = number_of_repos(data, startTime, endTime)
        leaderboard.generate(users)
    })
}

/**
 * Count the number of repos created between startTime and endTime for each user
 * @param users list returned by the graphql query
 * @param startTime only count repos after this time
 * @param endTime only count repos before this time
 * @return user list enriched with the count of valid repos
 */
function number_of_repos(users, startTime=(new Date(0)), endTime=(new Date())) {
    for(var key in users) {
        users[key]['repo_count'] = users[key]['repositories']['nodes'].filter(repo => {
            let createdAt = new Date(repo['createdAt'])
            return (createdAt > startTime && createdAt < endTime)
        }).length
    }
    return users
}
