define(
    'ui/components/nav/TopNav/TopNavRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render('ui/components/nav/TopNav', {
                    activeItem: input.activeItem
                }, context);
            }
        };
    });