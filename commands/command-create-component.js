var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

function getComponentInfo(name) {
    var lastSlash = name.lastIndexOf('/'),
        shortName = lastSlash === -1 ? name : name.slice(lastSlash+1),
        shortNameLower = shortName.toLowerCase(),
        shortNameDashSeparated = shortName.replace(/([a-z])([A-Z])/g, function(match, a, b) {
            return a + '-' + b;
        }).toLowerCase();
    return {
        name: name,
        shortName: shortName,
        shortNameLower: shortNameLower,
        shortNameDashSeparated: shortNameDashSeparated
    };
}

module.exports = {
    usage: 'Usage: $0 create component <component-name>',

    options: {
        'no-widget': {
            boolean: true,
            describe: 'Do not generate a widget'
        }
    },

    validate: function(args, rapido) {
        var name = args._[0];
        if (!name) {
            throw 'Component name is required';
        }

        return {
            name: name,
            includeWidget: args['widget'] !== false
        };
    },

    run: function(args, config, rapido) {
        var name = args.name;
        var baseDir = config['components.dir'] || process.cwd();
        var outputDir = new File(baseDir, name);
        var namespace = config['component.namespace'] || config['module.namespace'];
        if (namespace) {
            name = namespace + '/' + name;
        }

        var componentInfo = getComponentInfo(name);
        var scaffoldDir = config['scaffold.component.dir'];

        if (!scaffoldDir) {
            throw new Error('"scaffold.component.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                viewModel: {
                    ifWidget: args.includeWidget,
                    name: componentInfo.name,
                    shortName: componentInfo.shortName,
                    shortNameLower: componentInfo.shortNameLower,
                    shortNameDashSeparated: componentInfo.shortNameDashSeparated
                },
                afterFile: function(outputFile) {
                    // Register RTLD files in the app.rtld file
                    if (outputFile.getExtension() === 'rtld') {
                        var appRtldFile = config["rtld.file"];

                        if (appRtldFile) {
                            var rtldXml = appRtldFile.readAsString();
                            var componentRtldPath = path.relative(appRtldFile.getParent(), outputFile.getAbsolutePath());
                            
                            var relPathToRtld = path.relative(process.cwd(), appRtldFile.getAbsolutePath());

                            var newTaglibElement = '<import-taglib path="' + componentRtldPath + '"/>';
                            if (rtldXml.indexOf(newTaglibElement) === -1) {
                                rtldXml = rtldXml.replace('</raptor-taglib>', '    ' + newTaglibElement  + '\n</raptor-taglib>');
                                appRtldFile.writeAsString(rtldXml);
                                rapido.log.success('update', 'Imported taglib into "' + relPathToRtld + '"');
                            }
                        }
                    }
                }
            });
        rapido.log.success('finished', 'UI component written to "' + rapido.relativePath(outputDir) + '"');
        rapido.log('\nAdd the following dependency to your page:');
        rapido.log.info('<module name="' + name + '"/>');
        rapido.log('Or, to render client-side, add the following instead:');
        rapido.log.info('<module name="' + name + '/render"/>');
        rapido.log('\nCustom tag usage:');
        rapido.log.info('<app:' + componentInfo.shortNameDashSeparated + ' name="Frank" count="30"/>');
    },

    getComponentInfo: getComponentInfo
}