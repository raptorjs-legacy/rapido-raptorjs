define(
    'ui/components/ebay/search/search-results/search-results-renderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render(
                    'ui/components/ebay/search/search-results',
                    {
                        items: input.searchResultItems,
                        view: input.view || 'gallery'
                    },
                    context);
            }
        };
    });
