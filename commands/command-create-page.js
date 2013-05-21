var File = require('raptor/files/File');
var files = require('raptor/files');
var addRoutesRegExp = /addRoutes\s*=\s*function\([^\)]*\)\s*\{/;
var path = require('path');

module.exports = {

    usage: 'Usage: $0 create page <page-name>',

    options: {
        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
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
        var scaffoldDir = args.scaffoldDir || config["scaffold.page.dir"];
        if (!scaffoldDir) {
            throw new Error('"scaffold.page.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var name = args.name;
        var route = name;

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
                    overwrite: args.overwrite,
                    nameDashSeparated: nameDashSeparated,
                    shortName: shortName,
                    shortNameLower: shortNameLower,
                    shortNameDashSeparated: shortNameDashSeparated
                },
                afterFile: function(outputFile) {
                    
                }
            });

        if (config['routes.file'] && config['routes.file'].exists()) {
            var routesJs = config['routes.file'].readAsString();

            
            var relPath = './' + path.relative(config['routes.file'].getParent(), outputDir.getAbsolutePath());
            var newRouteJs = 'app.get("/' + route + '", require("' + relPath + '").controller);'
            if (routesJs.indexOf(newRouteJs) === -1) {
                if (addRoutesRegExp.test(routesJs)) {
                    routesJs = routesJs.replace(addRoutesRegExp, '$&\n    ' + newRouteJs);
                    config['routes.file'].writeAsString(routesJs);
                    rapido.log.success('update', 'Added route to "' + rapido.relativePath(config['routes.file'].getAbsolutePath()) + '"');
                }
            }
        }

        rapido.log.success('finished', 'Page written to "' + rapido.relativePath(outputDir) + '"');

        if (isStatic) {
            rapido.log('To build page:');
            rapido.log.info('node build.js ' + pagePath);
            rapido.log('Or, to build all pages:');
            rapido.log.info('node build.js');
        }
        
    }
}
