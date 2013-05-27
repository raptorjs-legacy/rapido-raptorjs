define(
    'ui/components/demo/Simple/SimpleRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render('ui/components/demo/Simple', {
                    name: input.name,
                    count: input.count
                }, context);
            }
        };
    });