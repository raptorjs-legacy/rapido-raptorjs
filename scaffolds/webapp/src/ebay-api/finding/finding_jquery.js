define.extend('ebay-api/finding', function(require) {

    return {
        _performServiceCall: function(url) {
            url += '?callback=?';
            return $.getJSON(url);
        }
    };
});
