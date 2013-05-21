var File = require('raptor/files/File'),
    files = require('raptor/files');

module.exports = {

    usage: 'Usage: $0 create page <page-name>',

    options: {
    },

    validate: function(args, rapido) {
        var name = args._[0];
        if (!name) {
            throw 'Page name is required';
        }
        return {
            name: name
        }
    },

    run: function(args, config, rapido) {
        var scaffoldDir = config["scaffold.page.dir"];
        if (!scaffoldDir) {
            throw new Error('"scaffold.page.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var name = args.name;


        var prefix = config['pages.prefix'];
        if (prefix) {
            if (prefix.endsWith('/')) {
                prefix = prefix.slice(0, -1);
            }
            name = prefix + '/' + name;
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

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                data: {
                    name: name,
                    nameDashSeparated: nameDashSeparated,
                    shortName: shortName,
                    shortNameLower: shortNameLower,
                    shortNameDashSeparated: shortNameDashSeparated
                },
                afterFile: function(outputFile) {
                    
                }
            });

        rapido.log.success('finished', 'Page written to "' + outputDir + '"');

        var isStatic = config['webapp.type'] === 'static';

        if (isStatic) {
            rapido.log('To build page:');
            rapido.log.info('node build.js ' + pagePath);
            rapido.log('Or, to build all pages:');
            rapido.log.info('node build.js');
        }
    }
}
