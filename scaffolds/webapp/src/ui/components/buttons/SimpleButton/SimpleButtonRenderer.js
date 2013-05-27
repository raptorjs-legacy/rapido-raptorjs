define(
    'ui/components/buttons/SimpleButton/SimpleButtonRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render(
                    'ui/components/buttons/SimpleButton',
                    {
                        label: input.label
                    },
                    context);
            }
        };
    });
