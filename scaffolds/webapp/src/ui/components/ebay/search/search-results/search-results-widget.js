define.Class(
    'ui/components/ebay/search/search-results/search-results-widget',
    function(require) {
        var pubsub = require('raptor/pubsub');

        return {
            init: function(widgetConfig) {
                pubsub.subscribe({
                    viewChange: function(eventArgs) {
                        var view = eventArgs.view;
                        this.setView(view);
                    }
                }, this);
            },

            setView: function(view) {
                if (view === 'list') {
                    this.$().addClass('view-list');
                    this.$().removeClass('view-gallery');
                }
                else if (view === 'gallery') {
                    this.$().addClass('view-gallery');
                    this.$().removeClass('view-list');
                }
            }
        };
    });
