var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

module.exports = {
    usage: 'Usage: $0 create lib [lib-name]',

    options: {
        // 'no-testing': {
        //     'boolean': true,
        //     describe: 'Do not generate code related to testing'
        // },
        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
    },


    validate: function(args, rapido) {
        var libName = args._[0],
            outputDir;

        if (!libName) {
            outputDir = new File(process.cwd());
            libName = new File(process.cwd()).getName();
        }
        else {
            outputDir = path.join(process.cwd(), libName);
        }

        return {
            overwrite: args.overwrite === true,
            name: libName,
            outputDir: outputDir,
            includeTesting: args.testing !== false
        }
    },

    run: function(args, config, rapido) {
        var outputDir = args.outputDir,
            overwrite = args.overwrite;
        
        var scaffoldDir = args.scaffoldDir || config["scaffold.library.dir"];

        if (!scaffoldDir) {
            throw new Error('"scaffold.library.dir" not defined in "' + rapido.configFilename + '" config file');
        }
        
        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: args.outputDir,
                overwrite: args.overwrite === true,
                data: {
                    libName: args.name,
                    ifTesting: args.includeTesting
                },
                afterFile: function(outputFile) {
                    
                },
                beforeFile: function(outputFile, content) {
                    
                }
            });
        rapido.log.success('finished', 'Library written to "' + outputDir + '"');
    }
}
