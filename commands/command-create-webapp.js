var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

var raptor = require('raptor');

module.exports = {
    usage: 'Usage: $0 create webapp [webapp-name]',

    options: {
        'static': {
            'boolean': true,
            describe: 'Generate a static, server-less web application'
        },
        'no-testing': {
            'boolean': true,
            describe: 'Do not generate code related to testing'
        },
        'overwrite': {
            'boolean': true,
            describe: 'Overwrite existing files'
        }
    },


    validate: function(args, rapido) {
        var appName = args._[0],
            outputDir;

        if (!appName) {
            outputDir = new File(process.cwd());
            appName = new File(process.cwd()).getName();
        }
        else {
            outputDir = path.join(process.cwd(), appName);
        }

        return {
            overwrite: args.overwrite === true,
            name: appName,
            outputDir: outputDir,
            includeTesting: args.testing !== false,
            type: args['static'] === true ? 'static' : 'dynamic'
        }
    },

    run: function(args, config, rapido) {
        var outputDir = args.outputDir,
            overwrite = args.overwrite;
        
        var isStatic = args.type === 'static';
        var scaffoldDir = args.scaffoldDir || config["scaffold.webapp.dir"];

        if (!scaffoldDir) {
            throw new Error('"scaffold.webapp.dir" not defined in "' + rapido.configFilename + '" config file');
        }

        var scaffoldData = raptor.extend(args, {
                appName: args.appName || args.name,
                ifStatic: isStatic,
                ifDynamic: !isStatic,
                webappType: args.type,
                ifTesting: args.includeTesting
            }, args.scaffoldData || {});
        
        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: args.outputDir,
                overwrite: true,
                data: scaffoldData,
                afterFile: function(outputFile) {
                    
                },
                beforeFile: function(outputFile, content) {
                    if (outputFile.exists()) {
                        if (outputFile.getName() === rapido.configFilename) {
                            // File already exists... we need to merge
                            var newConfig = JSON.parse(content);
                            rapido.updateConfig(outputFile, newConfig);
                            rapido.log.success('update', outputFile.getAbsolutePath());
                            return false;
                        }
                        return overwrite;
                    }

                    return true;
                }
            });
        rapido.log.success('finished', 'Webapp written to "' + outputDir + '"');
        rapido.log('All that is left is to run the following command:');
        rapido.log.info('npm install');
        if (isStatic) {
            rapido.log('\nAnd then build your static website using the following command:');
            rapido.log.info('node build.js');
            rapido.log('\nStatic pages and resources will be written to the following directory:');
            rapido.log.info(new File(outputDir, "build").getAbsolutePath());
        }
        else {
            rapido.log('\nUse the following command to start the server:');
            rapido.log.info('node server.js --dev');
        }
    }
}
