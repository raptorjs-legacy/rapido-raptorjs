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

    parseOptions: function(args, rapido) {

        var options;

        rapido.optimist(args)
            .usage('Usage: raptor create component <component-name>')
            .boolean('no-widget')
            .describe('no-widget', 'Do not generate a widget')
            .describe('help', 'Show this message')
            .check(function(argv) {
                if (argv.help) {
                    throw '';
                }

                var name = argv._[0];
                if (!name) {
                    throw 'Component name is required';
                }

                options = {
                    name: name,
                    includeWidget: argv['widget'] !== false
                }
            })
            .argv; 

        return options;
    },

    run: function(options, config, rapido) {
        var name = options.name;
        var baseDir = config['components.dir'] || process.cwd();
        var outputDir = new File(baseDir, name);
        var namespace = config['component.namespace'] || config['module.namespace'];
        if (namespace) {
            name = namespace + '/' + name;
        }

        var componentInfo = getComponentInfo(name);
        var scaffoldDir = config['scaffold.component.dir'];

        if (!scaffoldDir) {
            throw new Error('"scaffold.component.dir" not defined in ".rapido" config file');
        }

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                viewModel: {
                    ifWidget: options.includeWidget,
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
                            
                            var newTaglibElement = '<import-taglib path="' + componentRtldPath + '"/>';
                            if (rtldXml.indexOf(newTaglibElement) === -1) {
                                rtldXml = rtldXml.replace('</raptor-taglib>', '    ' + newTaglibElement  + '\n</raptor-taglib>');
                                appRtldFile.writeAsString(rtldXml);
                                rapido.log.success('update', 'Added ' + newTaglibElement + ' to "' + appRtldFile.getAbsolutePath()) + '"';
                            }
                        }
                    }
                }
            });
        rapido.log.success('finished', 'UI component written to "' + outputDir + '"');
        rapido.log('\nAdd the following dependency to your page:');
        rapido.log.info('<module name="' + name + '"/>');
        rapido.log('Or, to render client-side, add the following instead:');
        rapido.log.info('<module name="' + name + '/render"/>');
        rapido.log('\nCustom tag usage:');
        rapido.log.info('<app:' + componentInfo.shortNameDashSeparated + ' name="Frank" count="30"/>');
    },

    getComponentInfo: getComponentInfo
}