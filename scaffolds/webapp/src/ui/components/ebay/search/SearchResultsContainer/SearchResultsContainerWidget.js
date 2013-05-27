define.Class(
    'ui/components/ebay/search/SearchResultsContainer/SearchResultsContainerWidget',
    function(require) {
        var pubsub = require('raptor/pubsub'),
            searchResultsRenderer = require('ui/components/ebay/search/SearchResults/SearchResultsRenderer'),
            renderer = require('raptor/renderer');

        return {
            init: function(widgetConfig) {
                var _this = this;

                this.view = 'gallery';

                pubsub.subscribe({
                    searchBegin: function() {
                        this.$('#resultsContainer').fadeOut();
                        this.$('#searching').fadeIn();
                    },

                    searchEnd: function() {
                        this.$('#searching').fadeOut();
                    },

                    searchResults: function(eventArgs) {
                        this.showSearchResults(eventArgs.data.items);
                    }
                }, this);

                this.$('#viewIconList').click(function() {
                    _this.setView('list');
                });

                this.$('#viewIconGallery').click(function() {
                    _this.setView('gallery');
                });
            },

            setView: function(view) {
                if (this.view === view) {
                    return;
                }

                this.view = view;

                pubsub.publish('viewChange', {
                    view: view
                });

                this.$('#viewIconList').toggleClass('view-icon-selected');
                this.$('#viewIconGallery').toggleClass('view-icon-selected');
            },

            showSearchResults: function(searchResultItems) {
                this.$('#searching').fadeOut();
                this.$('#count').text(searchResultItems.length);

                renderer.render(
                    searchResultsRenderer,
                    {
                        searchResultItems: searchResultItems,
                        view: this.view
                    })
                    .replaceChildrenOf(this.getEl('resultsTarget'));

                this.$('#resultsContainer').fadeIn();
            }
        };
    });
