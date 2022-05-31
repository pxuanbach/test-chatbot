const request = require("request")


module.exports = function(obj) {
    return new Promise((resolve, rejects) => {
        request(obj, (error, response, body) => {
            if (!error) {
                resolve(body)
            } else {
                rejects(error)
            }
        })
    })
}