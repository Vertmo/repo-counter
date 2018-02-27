/**
 * Entry point
 * @author Basile Pesin
 */

var graphql = require('./graphql.js')
var config = require('./config.js')

graphql.client.connect(config.token)

graphql.client.request(`{viewer {login}}`).then(data => console.log(data))
