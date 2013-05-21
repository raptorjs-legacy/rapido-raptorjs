define(
    'ui/components/buttons/simple-button/simple-button-widget',
    function(require) {

        return {
            init: function(widgetConfig) {
                $(this.getEl()).on('click', function() {
                    alert('Button Clicked!');
                });
            },

            setColor: function(color) {
                this.getEl().style.backgroundColor = color;
            },

            setLabel: function(label) {
                this.getEl().innerHTML = label;
            }
        };
    });
