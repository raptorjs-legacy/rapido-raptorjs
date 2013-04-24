var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

module.exports = {
    usage: 'Usage: $0 create tag <tag-name> <class-name>',

    options: {
        
    },

    validate: function(args, rapido) {
        var tagName = args._[0];
        if (!tagName) {
            throw 'tag-name is required';
        }
        
        var className = args._[1];
        if (!className) {
            throw 'class-name is required';
        }

        return {
            className: className,
            tagName: tagName
        };
    },

    run: function(args, config, rapido) {
        var className = args.className;
        var tagName = args.tagName;

        var baseDir = config['modules.dir'] || process.cwd();
        var outputFile = new File(baseDir, className + ".js");
        var outputDir = outputFile.getParentFile();
        var shortName = outputFile.getNameWithoutExtension();

        rapido.scaffold(
            {
                scaffoldDirProperty: "scaffold.tag.dir",
                outputDir: outputDir,
                data: {
                    tagName: tagName,
                    className: className,
                    shortName: shortName
                }
            });

        var appRtldFile = config["rtld.file"];

        if (appRtldFile) {
            var rtldXml = appRtldFile.readAsString();
            var componentRtldPath = path.relative(appRtldFile.getParent(), outputFile.getAbsolutePath());
            
            var relPathToRtld = rapido.relativePath(appRtldFile);

            var newTagElement = '<tag name="' + tagName + '" renderer="' + className + '">\n' + 
                '        <attribute name="name" type="string"/>\n' + 
                '    </tag>';


            if (rtldXml.indexOf(className) === -1) {
                rtldXml = rtldXml.replace('</raptor-taglib>', '    ' + newTagElement  + '\n</raptor-taglib>');
                appRtldFile.writeAsString(rtldXml);
                rapido.log.success('update', 'Added tag to "' + relPathToRtld + '"');
            }
        }

        rapido.log.success('finished', 'Tag renderer written to "' + rapido.relativePath(outputFile) + '"');
    }
}