/*****************************************************/
// Initialize the environment
/*****************************************************/
var environment = process.env.NODE_ENV || 'development';

/*****************************************************/
// Parse command-line argument
/*****************************************************/
var optimistCommand = require('optimist')(process.argv.slice(2));
var argv = optimistCommand
    .usage('Usage: $0')
    .options({
        'dev': {
            describe: 'Enable development-mode',
            type: 'boolean'
        },
        'prod': {
            describe: 'Enable production-mode',
            type: 'boolean'
        },
        'h': {
            describe: 'Show this message',
            alias: 'help'
        }
    })
    .check(function(argv) {

        // Configure the environment mode
        if (argv.dev) {
            environment = 'development';
        }
        else if (argv.prod) {
            environment = 'production';
        }
    })
    .argv;

if (argv.help) {
    optimistCommand.showHelp();
    return;
}

process.env.NODE_ENV = environment;

/*****************************************************/
// Pull in top-level dependencies to start the server
/*****************************************************/
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

/*****************************************************/
// Initialize the application
/*****************************************************/
function initApp() {
    console.log('Initializing application...');
    require('raptor');
    require('raptor/logging').configure({
        loggers: {
            'ROOT': {
                level: 'WARN'
            },
            'raptor-optimizer-ready-plugin': {
                level: 'WARN'  
            },
            'raptor/optimizer': {
                level: 'WARN'  
            }
        }
    });

    var expressRaptor = require('express-raptor');

    require('raptor/optimizer').configure(
        path.join(__dirname, 'config/optimizer-config.xml'),
        {
            profile: environment
        });

    // Tell RaptorJS where to find modules:
    require('raptor/resources').addSearchPathDir(path.join(__dirname, 'src'));

    // Enable storing compiled Raptor Templates in a temporary directory:
    require('raptor/templating/compiler').setWorkDir(path.join(__dirname, 'work'));

    // Register any application data providers:
    expressRaptor.dataProviders(app, {

    });

    // Enable gzip compression
    app.use(express.compress());

    // Enable Express middleware to parse query string parameters
    app.use(express.query());

    // For hot-reloading, we need to reset the routes before adding back the application routes:
    expressRaptor.resetRoutes(app, express);

    // Add any routes required by the RaptorJS Optimizer
    expressRaptor.addOptimizerRoutes(app, null, express);

    // Add the application routes defined in a separate file:
    require('./routes').addRoutes(app, environment);

    app.use(function(err, req, res, next) {
        require('raptor/logging').logger('server').error('An error has occurred for request "' + req.url + '". Exception: ' + err, err);
        res.send(500, '<html><head><title>An Error has Occurred</title></head><body><pre>' + (err.stack || err) + '</pre></body></html>');
    });

    console.log('Application Initialized');
}

initApp();

/*****************************************************/
// Start the server or cluster
/*****************************************************/
if (environment === 'production') {
    // Isolate eBay-specific code as much as possible...
    // Start the cluster and the monitoring app:
    var Cluster = require("cluster2");
    var theCluster = new Cluster({
        port: 8080,
        cluster: true,
        connThreshold: 10,
        ecv: {
            control: true
        }
    }).listen(function(cb) {
        cb(server);
    });

    console.log("Listing on port 8080, and started as cluster");
    new RaptorConfig("./work/config", theCluster);
}
else {
    // Enable web sockets for live coding:
    var io = require('socket.io').listen(server, { log: false });

    // No clustering...just listen on port 8080:
    var port = 8080;
    server.listen(port, function() {
        console.log('Listening on port ' + port + '\nTry: http://localhost:' + port + '/');

        // Configure and enable hot reloading in development-mode:
        var hotReloader = require('raptor-hot-reload').create(require)
            .loggingEnabled(true)
            // Uncache all cached Node modules
            .uncache('*')
            // By-pass the full reload for certain files
            //.specialReload(path.join(__dirname, 'optimizer-config.xml'), function)
            .specialReload(path.join(__dirname, 'routes.js'), function(path) {
                delete require.cache[path];
                initApp();
            })
            .specialReload('*.css', function() {
                // Do nothing
            })
            // Configure which directories/files to watch:
            .watch(path.join(__dirname, 'src'))
            .watch(path.join(__dirname, 'config'))
            // .watchExclude("*.css") //Ignore modifications to certain files

            // Register a listener for the "beforeReload" event"
            .beforeReload(function() {

            })

            // Register a listener for the "afterReload" event
            .afterReload(function(eventArgs) {
                // Re-initialize the application after a full reload
                initApp();
            })
            // Enable support for auto-reloading the browser in response
            // to modifications to files on the server
            .clientAutoReload(io.sockets)
            .start(); // Start watching for changes!
    })
    .on('error', function(err) {
        console.error('Server failed to start. ' + err);
    });
}
