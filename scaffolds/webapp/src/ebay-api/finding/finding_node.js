var request = require('request');

define.extend('ebay-api/finding', function(require) {

    var promises = require('raptor/promises');

    return {

        _performServiceCall: function(url) {
            var deferred = promises.defer();

            request(url, function(error, response, body) {
                if (error) {
                    deferred.reject(error);
                }
                else {
                    deferred.resolve(JSON.parse(body));
                }
            });

            return deferred.promise;
        }
    };
});
