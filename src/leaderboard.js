/**
 * Leaderboard generation
 * @module leaderboard
 * @author Basile Pesin
 */

function generate_leaderboard(data) {
    users = []
    for(var key in data) users.push(data[key])
    users.sort(compare_users)
    console.log(users)

    // Generate leaderboard
    $('#leaderboard').empty()
    for(var i=0; i<Math.min(10, users.length); i++) {
        var item = $('<div class="item"></div>')
        if(i==0) item.attr('style', 'background-color: gold')
        if(i==1) item.attr('style', 'background-color: silver')
        if(i==2) item.attr('style', 'background-color: #dca570')

        item.append($('<img class="ui avatar image">').attr('src', users[i]['avatarUrl']))
        content = $('<div class="content"></div>')
        content.append($('<a class="header"></a>')
            .attr('href', 'https://github.com'+users[i]['resourcePath'])
            .append(users[i]['login']))
        content.append('Created ' + users[i]['repositories']['nodes']['length'] + ' repositories')
        item.append(content)

        $('#leaderboard').append(item)
    }
}

/**
 * Compare two users using number of repos created (descending order).
 * TODO : Count only the repos created since startdate
 */
function compare_users(x, y) {
    return y['repositories']['nodes']['length'] - x['repositories']['nodes']['length']
}

module.exports = {
    generate: generate_leaderboard
}
