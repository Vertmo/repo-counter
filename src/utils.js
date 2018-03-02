/**
 * General purpose utilities functions
 * @module utils
 * @author Basile Pesin
 */

/**
 * Count the number of repos created between startTime and endTime for each user
 * @param users list returned by the graphql query
 * @param startTime only count repos after this time
 * @param endTime only count repos before this time
 * @return user list enriched with the count of valid repos
 */
function numberOfRepos(users, startTime=(new Date(0)), endTime=(new Date())) {
    for(var key in users) {
        users[key]['repo_count'] = users[key]['repositories']['nodes'].filter(repo => {
            let createdAt = new Date(repo['createdAt'])
            return (createdAt > startTime && createdAt < endTime)
        }).length
    }
    return users
}

module.exports = {
    numberOfRepos: numberOfRepos
}
