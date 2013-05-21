var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

module.exports = {
    usage: 'Usage: $0 create static site [site-name]',

    options: {
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
            type: 'static'
        }
    },

    run: function(args, config, rapido) {
        rapido.runCommand('raptorjs', 'create webapp', args);
    }
}
