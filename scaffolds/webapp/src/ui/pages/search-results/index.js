var expressRaptor = require('express-raptor');
var promises = require('raptor/promises');

exports.controller = expressRaptor.handler(function(context, req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    var searchResultsPromise = require('ebay-api/finding').performSearch({
        keywords: req.params.keywords || 'nike'
    });

    context.dataProviders({
        searchResults: function(args) {
            return searchResultsPromise;
        },

        user: function(args) {
            var deferred = promises.defer();
            setTimeout(function() {
                deferred.resolve({
                    name: 'Frank'
                });
            }, args.delay);

            return deferred.promise;
        }
    });

    context.renderTemplate(
        '/ui/pages/search-results/search-results.rhtml',
        {
        });
})