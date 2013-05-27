var File = require('raptor/files/File');
var files = require('raptor/files');
var path = require('path');

module.exports = {

    usage: 'Usage: $0 create module <module-name>',

    options: {
        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
    },

    validate: function(args, rapido) {
        var name = args._[0];
        if (!name) {
            throw 'Module name is required';
        }
        return {
            name: name
        }
    },

    run: function(args, config, rapido) {
        var scaffoldDir = args.scaffoldDir || config["scaffold.module.dir"];
        if (!scaffoldDir) {
            throw new Error('"scaffold.module.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var name = args.name;

        if (!name) {
            throw new Error("Module name is required");
        }

        var prefix = config['modules.prefix'];
        if (prefix) {
            if (prefix.endsWith('/')) {
                prefix = prefix.slice(0, -1);
            }
            name = prefix + '/' + name;
        }

        if (name.startsWith('/')) {
            name = name.substring(1);
        }

        var lastSlash = name.lastIndexOf('/');
        var shortName = lastSlash === -1 ? name : name.slice(lastSlash+1);

        var baseDir = config['modules.dir'] || process.cwd();
        var outputDir = name ? new File(baseDir, name) : baseDir;

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: outputDir,
                overwrite: args.overwrite,
                data: {
                    name: name,
                    shortName: shortName
                },
                afterFile: function(outputFile) {
                    
                }
            });

        rapido.log.success('finished', 'Module written to "' + rapido.relativePath(outputDir) + '"');        
    }
}
