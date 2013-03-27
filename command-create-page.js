var File = require('raptor/files/File'),
    files = require('raptor/files');

module.exports = {
    description: "Generates a RaptorJS page",

    parseOptions: function(args) {

        var options;

        require('optimist')(args)
        .usage('Usage: $0 create page <page-name> [options]\n')
        .check(function(argv) {
            var name = argv._[0];
            if (!name) {
                throw 'Page name is required';
            }
            options = {
                name: name
            }
        })
        .argv; 

        return options;
    },

    run: function(options, config, cli) {
        var name = null;

        var scaffoldDir = config["scaffold.page.dir"];
        if (!scaffoldDir) {
            throw new Error('"scaffold.page.dir" not defined in ".raptor" config file');
        }

        var pagePath = name;

        if (name.startsWith('/')) {
            name = name.substring(1);
        }
        else {
            pagePath = '/' + pagePath;
        }

        function dashSeparate(str) {
            return str.replace(/([a-z])([A-Z])/g, function(match, a, b) {
                return a + '-' + b;
            }).toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        }


        var isStatic = config['webapp.type'] === 'static';
        var baseDir = config['pages.dir'] || process.cwd();
        var outputDir = name ? new File(baseDir, name) : baseDir;

        if (!name) {
            name = 'index';
        }

        var lastSlash = name.lastIndexOf('/'),
            shortName = lastSlash === -1 ? name : name.slice(lastSlash+1),
            shortNameLower = shortName.toLowerCase(),
            shortNameDashSeparated = dashSeparate(shortName),
            nameDashSeparated = dashSeparate(name),
            dirPath = name;

        var viewModel = {
                name: name,
                nameDashSeparated: nameDashSeparated,
                shortName: shortName,
                shortNameLower: shortNameLower,
                shortNameDashSeparated: shortNameDashSeparated
            };

        cli.generate(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                viewModel: viewModel,
                afterFile: function(outputFile) {
                    
                }
            });

        cli.logSuccess('finished', 'Page written to "' + outputDir + '"');

        var isStatic = config['webapp.type'] === 'static';

        if (isStatic) {
            cli.log('\nTo build page:\n#cyan[node build.js ' + pagePath + ']');
        }
    }
}
