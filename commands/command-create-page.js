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
            name: name,
            overwrite: args['overwrite'] === true
        }
    },

    run: function(args, config, rapido) {
        var scaffoldDir = args.scaffoldDir || config["scaffold.page.dir"];
        if (!scaffoldDir) {
            throw new Error('"scaffold.page.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var name = args.name;
        var unprefixedName = name;
        var route = '/' + name;

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

        var componentsDir = config['components.dir'];
        var topNavDir = new File(componentsDir, 'ui/components/nav/TopNav');
        var includeTopNav = topNavDir.exists();

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                overwrite: args.overwrite,
                data: {
                    name: name,
                    nameDashSeparated: nameDashSeparated,
                    shortName: shortName,
                    shortNameLower: shortNameLower,
                    shortNameDashSeparated: shortNameDashSeparated,
                    includeTopNav: includeTopNav,
                    unprefixedName: unprefixedName
                },
                afterFile: function(outputFile) {
                    
                }
            });

        var routeAvailable = false;

        if (config['routes.file'] && config['routes.file'].exists()) {
            var routesJs = config['routes.file'].readAsString();

            var relPath = './' + path.relative(config['routes.file'].getParent(), outputDir.getAbsolutePath());
            var newRouteJs = 'app.get("' + route + '", require("' + relPath + '"));';

            if (routesJs.indexOf(newRouteJs) === -1) {
                if (addRoutesRegExp.test(routesJs)) {
                    routesJs = routesJs.replace(addRoutesRegExp, '$&\n    ' + newRouteJs);
                    config['routes.file'].writeAsString(routesJs);
                    rapido.log.success('update', 'Added route "' + route + '" to "' + rapido.relativePath(config['routes.file'].getAbsolutePath()) + '"');
                    routeAvailable = true;
                }
            }
            else {
                routeAvailable = true;
            }
        }

        rapido.log.success('finished', 'Page written to "' + rapido.relativePath(outputDir) + '"');

        var pageUrl = 'http://localhost:8080' + route;

        if (args.callback) {
            args.callback({
                url: pageUrl,
                outputDir: outputDir
            });
        }

        if (routeAvailable) {
            rapido.log.info('\nUse the following URL to test your page:');
            rapido.log.info(pageUrl);
        }

        if (isStatic) {
            rapido.log('To build page:');
            rapido.log.info('node build.js ' + pagePath);
            rapido.log('Or, to build all pages:');
            rapido.log.info('node build.js');
        }
        
    }
}
