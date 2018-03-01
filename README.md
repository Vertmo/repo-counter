# repo-counter #
A web app using Github's Graphql API to count repo created during a given period of time. May be used in a future Github workshop

## What you need ##
* npm
* browserify, installed using `npm install -g browserify`

## Usage ##
* install the dependancies with `npm install`
* place a config.js file in the src folder, containing :
```javascript
module.exports = {
    token: "{token}"
}
```
Where {token} is a [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with access to the `repo` and `user` scopes.
* browserify the set of js files using `npm run browser`
* the app is ready ! You can view it by opening the index.html file with your favorite web browser, or use a fancy web server.
