var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

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
        }
    },


    validate: function(args, rapido) {
        var appName = args._[0].
            outputDir;

        if (!appName) {
            outputDir = new File(process.cwd());
            appName = new File(process.cwd()).getName();
        }
        else {
            outputDir = path.join(process.cwd(), appName);
        }

        return {
            name: appName,
            outputDir: outputDir,
            includeTesting: args.testing !== false,
            type: args['static'] === true ? 'static' : 'dynamic'
        }
    },

    run: function(args, config, rapido) {
        var scaffoldDir = config["scaffold.webapp.dir"];
        if (!scaffoldDir) {
            console.error('"scaffold.webapp.dir" not defined in .rapido config file');
            return;
        }

        var isStatic = args.type === 'static';

        rapido.scaffold(
            {
                scaffoldDir: scaffoldDir,
                outputDir: args.outputDir,
                viewModel: {
                    appName: args.name,
                    ifStatic: isStatic,
                    ifDynamic: !isStatic,
                    webappType: args.type,
                    ifTesting: args.includeTesting
                },
                afterFile: function(outputFile) {
                    
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
    }
}
