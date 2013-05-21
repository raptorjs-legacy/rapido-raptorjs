var expressRaptor = require('express-raptor');

exports.controller = expressRaptor.handler(function(context, req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    context.renderTemplate(
        '/ui/pages/ui-components/ui-components.rhtml',
        {
            name: 'Frank'
        });
})