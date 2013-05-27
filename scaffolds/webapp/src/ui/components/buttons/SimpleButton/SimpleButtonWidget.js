define(
    'ui/components/buttons/SimpleButton/SimpleButtonWidget',
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
