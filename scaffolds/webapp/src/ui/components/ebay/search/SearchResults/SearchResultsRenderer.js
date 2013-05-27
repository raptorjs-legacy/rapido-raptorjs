define(
    'ui/components/ebay/search/SearchResults/SearchResultsRenderer',
    function(require) {
        var templating = require('raptor/templating');

        return {
            render: function(input, context) {
                templating.render(
                    'ui/components/ebay/search/SearchResults',
                    {
                        items: input.searchResultItems,
                        view: input.view || 'gallery'
                    },
                    context);
            }
        };
    });
