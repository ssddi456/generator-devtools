var path    = require('path');
var debug_name = path.basename(__filename,'.js');
if( debug_name == 'index'){
  debug_name = path.basename(__dirname);
}
(require.main === module) && (function(){
    process.env.DEBUG = '*';
})()
var debug = require('debug')(debug_name);

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, resp, next) {
  resp.render('index', { title: 'Express' });
});

function route_relative(_path) {
  return path.join(__dirname, '..', _path);
}

var view_root = route_relative('views');
var static_root = route_relative('public');

var fsExtra = require('fs-extra');
var async = require('async');


var watch_pathes = [ route_relative('public'), route_relative('views') ];

var visitable_map = [
  '.jpg',
  '.gif',
  '.png',
  '.svg',
  '.html',
  '.js',
  '.txt',
  '.json'
];

var href_map = {
  'D:\\gitchunk\\generator-devtools\\generators\\app\\templates\\views\\index.jade' : '/'
};

router.get('/tree',function(req, resp, next) {
  var type = req.params.type;
  var items = []; // files, directories, symlinks, etc

  async.each(watch_pathes, function( root, done ) {

    fsExtra.walk( root )
      .on('data', function (item) {
        var ext = path.extname(item.path);
        var visitable = visitable_map.indexOf(ext) == -1;

        items.push({
          name : path.basename(item.path),

          // 
          // description as a id
          // then make a interface to get the detail
          // (from compile caches)
          // 

          description : item.path,

          type : item.stats.isFile() ? 'file' : 'folder',
          directory : path.dirname(item.path),
          root : root,
          href : href_map[item.path] || (!visitable && path.relative(root, item.path)),
          unvisitable : visitable,
        });

      })
      .on('end',  done);

  }, function() {
    resp.json({ 
      err : 0, 
      items : items,
      roots : watch_pathes
    });
  })

});

router.get('/detail',function( req, resp, next ) {
  var description =  req.params.description;

  resp.json({
    err : 0,
    detail : {}
  });

});



var watchr = require('watchr');
watchr.watch({
    paths: watch_pathes,
    listeners: {
        log: function(logLevel){
          if( logLevel =='debug' ){
            return;
          }
          debug('a log message occured:', arguments);
        },
        error: function(err){
            debug('an error occured:', err);
        },
        watching: function(err,watcherInstance,isWatching){
            if (err) {
                debug("watching the path " + watcherInstance.path + " failed with error", err);
            } else {
                debug("watching the path " + watcherInstance.path + " completed");
            }
        },
        change: function(changeType, filePath, fileCurrentStat, filePreviousStat){
          debug('a change event occured:', changeType, filePath);
          if( changeType == 'update' ){

            if( filePath.indexOf( view_root ) == 0 ){
              debug('template change ');
              reload( filePath );
            } else {
              debug('static file change');
              reload( '/' + path.relative(static_root, filePath).replace(/\\/g, '/') );
            }
          }
        }
    },
    next: function(err,watchers){
        if (err) {
            return debug("watching everything failed with error", err);
        } else {
            debug('watching everything completed');
        }

        // Close watchers after 60 seconds example
        // setTimeout(function(){
        //     var i;
        //     debug('Stop watching our paths');
        //     for ( i=0;  i<watchers.length; i++ ) {
        //         watchers[i].close();
        //     }
        // },60*1000);
    }
});



var LRServer = require('../bin/livereload_server_instance');
function reload( filepath ){
  debug('reload', filepath);

  LRServer.broadcast({
    command: 'reload',
    path: filepath,
    liveCSS: true
  });
}


module.exports = router;
