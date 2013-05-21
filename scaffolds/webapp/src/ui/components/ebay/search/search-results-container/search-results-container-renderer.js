define(
    'ui/components/ebay/search/search-results-container/search-results-container-renderer',
    function(require) {
        var templating = require('raptor/templating'),
            File = require('raptor/files/File'),
            sampleSearchResultItems = JSON.parse(new File(__dirname, 'sample-data.json').readAsString()).items;


        return {
            render: function(input, context) {
                //test
                var searchResults = input.searchResults;
                var searchResultItems = searchResults ? searchResults.items : [];

                templating.render('ui/components/ebay/search/search-results-container', {
                    searchResultItems: searchResultItems// || sampleSearchResultItems
                }, context);
            }
        };
    });
