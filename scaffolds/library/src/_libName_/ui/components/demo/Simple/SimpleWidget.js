define.Class(
    'ui/components/demo/Simple/SimpleWidget',
    function(require, exports, module) {
        var logger = module.logger();

        return {
            init: function(widgetConfig) {
                this.$().click(function() {
                    this.setColor('red');

                    this.publish('click', {
                        widget: this
                    });
                }.bind(this));
            },

            events: ['click'],

            renderer: 'ui/components/demo/Simple/SimpleRenderer',

            setColor: function(color) {
                this.getEl().style.backgroundColor = color;
            }
        };
    });