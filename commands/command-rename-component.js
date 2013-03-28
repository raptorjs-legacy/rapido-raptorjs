var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

function normalize(name) {
    if (name.startsWith('/')) {
        name = name.substring(1);
    }
    return name;
}

module.exports = {

    usage: 'Usage: $0 rename component <old-component-name> <new-component-name>',

    options: {
        'no-update-references': {
            boolean: true,
            describe: 'Do not update references to all components'
        }
    },

    validate: function(args, rapido) {
        var oldName = argv._[0];
        var newName = argv._[1];

        if (!oldName || !newName) {
            throw '"old-component-name" and "new-component-name" are required';
        }

        oldName = normalize(oldName);
        newName = normalize(newName);

        if (argv['update-references'] === false) {
            updateReferences = false;
        }

        return {
            oldName: oldName,
            newName: newName,
            updateReferences: updateReferences
        }
    },

    run: function(args, config, rapido) {
        // Rename tasks:
        // 1) Move the component directory
        // 2) Rename all of the files
        // 3) Rename {shortNameDashSeparated} inside the component directory only
        // 4) Rename {name} everywhere
        // 5) Rename {name}/{shortName} everywhere
        
        var getComponentInfo = 
            rapido.getCommandModule('raptorjs', 'create component')
            .getComponentInfo;

        var oldInfo = getComponentInfo(oldName);
        var newInfo = getComponentInfo(newName);

        var componentsDir = config['components.dir'];
        var oldDir = new File(path.join(componentsDir, oldName));
        var newDir = new File(path.join(componentsDir, newName));

        rapido.log.info('rename', 'Renaming component "' + oldName + '" to "' + newName + '"');
        rapido.log.info('info', 'Old directory: ' + oldDir.getAbsolutePath());
        rapido.log.info('info', 'New directory: ' + newDir.getAbsolutePath());

        require('raptor/files/walker').walk(
            oldDir, 
            function(file) {
                if (!file.isFile()) {
                    return;
                }

                var relPath = file.getAbsolutePath().substring(oldDir.getAbsolutePath().length);
                var outFile = new File(newDir, relPath);
                rapido.log.info('copy', file.getAbsolutePath() + ' --> ' + outFile.getAbsolutePath());
            });
    }
}
