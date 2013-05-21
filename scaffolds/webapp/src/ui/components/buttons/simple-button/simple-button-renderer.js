define(
    'ui/components/buttons/simple-button/simple-button-renderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render(
                    'ui/components/buttons/simple-button',
                    {
                        label: input.label
                    },
                    context);
            }
        };
    });
