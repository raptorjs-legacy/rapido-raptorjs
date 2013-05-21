define(
    'ui/components/demo/simple/simple-renderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render('ui/components/demo/simple', {
                    name: input.name,
                    count: input.count
                }, context);
            }
        };
    });