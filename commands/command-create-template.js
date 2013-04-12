var File = require('raptor/files/File'),
    files = require('raptor/files'),
    path = require('path');

module.exports = {
    usage: 'Usage: $0 create template [path]\n' +
            'Examples:\n' +
            'Generate a file named "template.rhtml" in the current directory:\n' + 
            '  $0 create template\n' + 
            'Generate a file named "my-template.rhtml" in the current directory:\n' + 
            '  $0 create template my-template',

    options: {
        'name': {
            describe: 'The template name'
        },
        'path': {
            describe: 'The relative file path'
        },
        'params': {
            describe: 'Comma-separated list of template params'
        },
        'taglibs': {
            describe: 'Comma-separated list of taglibs to import'
        },
        'class-name': {
            describe: 'CSS class name for the root element'
        },
        'widget': {
            describe: 'JavaScript class name for the widget'
        },
        'overwrite': {
            describe: 'Overwrite existing template if one exists',
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
        

        var name = args.name,
            templatePath = args.path,
            params = args.params,
            taglibs = args.taglibs,
            className = args['class-name'],
            widget = args.widget,
            overwrite = args.overwrite;

        if (!templatePath) {
            if (name) {
                templatePath = name;
            }
            else {
                templatePath = 'template';
            }
        }

        if (!name) {
            if (templatePath.startsWith('/') || templatePath.indexOf(':') != -1) {
                name = templatePath.basename(templatePath);
            }
            else {
                name = templatePath;    
            }
            
            if (name.endsWith('.rhtml')) {
                name = name.slice(0, 0 - '.rhtml'.length);
            }
        }

        if (!templatePath.endsWith('.rhtml')) {
            templatePath += '.rhtml';
        }

        if (taglibs) {
            taglibs = taglibs.split(/\s*,\s*/);
            
        }
        else {
            taglibs = ["c:core"];
        }

        taglibs = '\n' + taglibs.map(function(taglib) {
            var prefix = taglib;
            var parts = taglib.split(/[:]/);
            if (parts.length === 2) {
                prefix = parts[0];
                taglib = parts[1];
            }
            return '    xmlns:' + prefix +'="' + taglib + '"';
        }).join('\n');

        var paramsArray = null,
            defaultParams = false;
        if (params === null || params === undefined) {
            defaultParams = true;
            params = 'name,count';
        }
        else {
            if (params) {
                paramsArray = params.split(/\s*,\s*/);        
            }
            else {
                paramsArray = [];
            }
        }
        
        var filename = path.basename(templatePath, '.rhtml');
        var outputFile = new File(path.resolve(process.cwd(), templatePath));
        var outputDir = outputFile.getParentFile();

        rapido.scaffold(
            {
                scaffoldDirProperty: "scaffold.template.dir",
                outputDir: outputDir,
                data: {
                    filename: filename,
                    name: name,
                    params: params,
                    paramsArray: paramsArray,
                    defaultParams: defaultParams,
                    taglibs: taglibs,
                    ifWidget: widget != null,
                    widget: widget,
                    className: className || name
                },
                overwrite: overwrite,
                afterFile: function(outputFile) {
                    
                }
            });
        rapido.log.success('finished', 'Template written to "' + outputFile + '"');
    }
}
