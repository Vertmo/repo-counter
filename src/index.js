/**
 * Entry point
 * @author Basile Pesin
 */

var graphql = require('./graphql.js')
var config = require('./config.js')
var utils = require('./utils.js')
var leaderboard = require('./leaderboard.js')
var stats = require('./stats')

graphql.client.connect(config.token)

$(function() {
    // Set the time pickers
    $('#startTimePicker').timepicker({ 'timeFormat': 'H:i' }).timepicker('setTime', new Date())
    $('#endTimePicker').timepicker({ 'timeFormat': 'H:i' }).timepicker('setTime', new Date())

    $('#startTimePicker').change(() => {
        refreshQuery()
    })

    $('#endTimePicker').change(() => {
        refreshQuery()
    })

    stats.createChart()

    refreshQuery()
    setInterval(refreshQuery, 60000)
})

/**
 * Send the query and apply all the changes, generally called on a timeout or after form change
 */
function refreshQuery() {
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
        repositories(last:100, orderBy: {field: CREATED_AT, direction:ASC}, privacy:PUBLIC, affiliations:[OWNER]) {
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

        let users = utils.numberOfRepos(data, startTime, endTime)
        leaderboard.generate(users)

        // Lets make the stats
        if(new Date() < endTime) endTime = new Date()
        var repoStats = stats.calculateStats(data, startTime, endTime)
        stats.updateChart(repoStats.labels, repoStats.data)
    })
}
