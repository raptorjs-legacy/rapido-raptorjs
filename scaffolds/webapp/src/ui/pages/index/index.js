var expressRaptor = require('express-raptor');
var promises = require('raptor/promises');

exports.controller = expressRaptor.handler(function(context, req, res, next) {
    res.setHeader('Content-Type', 'text/html');


    context.dataProviders({
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
        '/ui/pages/index/index.rhtml',
        {
            name: 'Frank'
        });
});