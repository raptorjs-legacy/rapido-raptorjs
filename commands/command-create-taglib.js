var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

module.exports = {
    usage: 'Usage: $0 create taglib [path]\n' +
            'Examples:\n' +
            'Generate a taglib file named "app.rtld" in the current directory:\n' + 
            '  $0 create taglib\n' + 
            'Generate a taglib file named "my-taglib.rtld" in the current directory:\n' + 
            '  $0 create taglib my-taglib',

    options: {
        'uri': {
            describe: 'The taglib URI'
        },
        'overwrite': {
            describe: 'Overwrite existing taglib if one exists',
            boolean: true
        }
    },

    validate: function(args, rapido) {
        if (args._.length) {
            args.path = args._[0];
        }

        delete args._;

        return args;
    },

    run: function(args, config, rapido) {
        

        var uri = args.uri,
            taglibPath = args.path,
            overwrite = args.overwrite;

        if (!taglibPath) {
            if (uri) {
                taglibPath = uri;
            }
            else {
                taglibPath = 'app.rtld';
            }
        }

        if (!uri) {
            if (taglibPath.startsWith('/') || taglibPath.indexOf(':') != -1) {
                uri = taglibPath.baseuri(taglibPath);
            }
            else {
                uri = taglibPath;    
            }
            
            if (uri.endsWith('.rtld')) {
                uri = uri.slice(0, 0 - '.rtld'.length);
            }
        }
        
        if (!taglibPath.endsWith('.rtld')) {
            taglibPath += '.rtld';
        }

        var outputFile = new File(path.resolve(process.cwd(), taglibPath));
        var outputDir = outputFile.getParentFile();
        
        rapido.scaffold(
            {
                scaffoldDirProperty: "scaffold.taglib.dir",
                outputDir: outputDir,
                data: {
                    uri: uri
                },
                overwrite: overwrite,
                afterFile: function(outputFile) {
                    
                }
            });

        var configInfo = rapido.findClosestConfig();
        if (!configInfo.config['rtld.file']) {
            var relativePath = rapido.relativePath(outputFile);
            rapido.updateConfig(configInfo.file, {
                'rtld.file': relativePath
            });
        }

        rapido.log.success('finished', 'Taglib written to "' + outputFile + '"');
    }
}
