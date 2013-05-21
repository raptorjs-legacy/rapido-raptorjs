var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path'),
    raptor = require('raptor');


var gradients = [
    ["hsl(220,97%,90%)", "hsl(220,97%,70%)"],
    ["hsl(346,96%,90%)", "hsl(346,96%,70%)"],
    ["hsl(107,87%,90%)", "hsl(107,87%,70%)"],
    ["hsl(53,87%,90%)", "hsl(53,87%,70%)"],
    ["hsl(299,82%,90%)", "hsl(299,82%,70%)"],
    ["hsl(27,100%,90%)", "hsl(27,100%,70%)"],
    ["hsl(318,100%,90%)", "hsl(318,100%,70%)"],
    ["hsl(74,75%,90%)", "hsl(74,75%,70%)"],
    ["hsl(17,47%,90%)", "hsl(17,47%,70%)"],
    ["hsl(309,85%,90%)", "hsl(309,85%,70%)"],
    ["hsl(91,78%,90%)", "hsl(91,78%,70%)"],
    ["hsl(6,100%,90%)", "hsl(6,100%,70%)"],
    ["hsl(70,38%,90%)", "hsl(70,38%,70%)"]
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomGradient() {
  var index = getRandomInt(0, gradients.length-1);
  return gradients[index];
}

function getComponentInfo(name) {
    var lastSlash = name.lastIndexOf('/'),
        shortName = lastSlash === -1 ? name : name.slice(lastSlash+1),
        shortNameDashSeparated = shortName.replace(/([a-z])([A-Z])/g, function(match, a, b) {
            return a + '-' + b;
        }).toLowerCase();

    var isLower = shortName.charAt(0) === shortName.charAt(0).toLowerCase();
    var widgetName;
    var rendererName;
    var widgetFilename;
    var rendererFilename;

    if (isLower) {
        widgetName = name + '/' + shortName + '-widget';
        widgetFilename = shortName + '-widget';
        rendererName = name + '/' + shortName + '-renderer';
        rendererFilename = shortName + '-renderer';
    }
    else {
        widgetName = name + '/' + shortName + 'Widget';
        widgetFilename = shortName + 'Widget';
        rendererName = name + '/' + shortName + 'Renderer';
        rendererFilename = shortName + 'Renderer';
    }

    return {
        name: name,
        shortName: shortName,
        widgetName: widgetName,
        widgetFilename: widgetFilename,
        rendererFilename: rendererFilename,
        rendererName: rendererName,
        tagName: shortNameDashSeparated,
        cssClassName: shortNameDashSeparated,
        templateName: name
    };
}

module.exports = {
    usage: 'Usage: $0 create component <component-name>',

    options: {
        'no-widget': {
            boolean: true,
            describe: 'Do not generate a widget'
        },
        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
    },

    validate: function(args, rapido) {
        var name = args._[0];
        if (!name) {
            throw 'Component name is required';
        }

        return {
            name: name,
            includeWidget: args['widget'] !== false,
            overwrite: args['overwrite'] === true
        };
    },

    run: function(args, config, rapido) {
        var name = args.name;

        if (name.startsWith('/')) {
            name = name.substring(1);
        }

        if (name.endsWith('/')) {
            name = name.slice(0, -1);
        }

        var baseDir = config['components.dir'] || process.cwd();
        
        var prefix = config['components.prefix'];
        if (prefix) {
            if (prefix.endsWith('/')) {
                prefix = prefix.slice(0, -1);
            }
            name = prefix + '/' + name;
        }

        var outputDir = new File(baseDir, name);
        var componentInfo = getComponentInfo(name);
        var scaffoldDir = config['scaffold.component.dir'];

        if (!scaffoldDir) {
            throw new Error('"scaffold.component.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var gradient = getRandomGradient();

        var data = {
            ifWidget: args.includeWidget,
            gradientStart: gradient[0],
            gradientEnd: gradient[1],
        };

        raptor.extend(data, componentInfo);

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                overwrite: args.overwrite,
                data: data,
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
        rapido.log.info('<app:' + componentInfo.tagName + ' name="Frank" count="30"/>');
    },

    getComponentInfo: getComponentInfo
}