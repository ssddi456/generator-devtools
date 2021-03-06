define([
  'knockout'
],function(
  ko
){
  var vm = {
    attributes : ko.observableArray(),
    node : ko.observable().extend({ rateLimit : 1000 })
  };
var visible_keys = [
  "origin",
  "hash",
  "query",
  "ext",
  "useCompile",
  "useDomain",
  "useCache",
  "useHash",
  "useMap",
  "_isImage",
  "_isText",
  "isMod",
  "requires",
  "extras",
  "_likes",
  "charset",
  "release",
  "url",
  "id"
];

  vm.node.subscribe(function(node, prev ) {

    $.getJSON('/node_conf',
      { 
        node_path : node.description(),
        root  : node.root
      },
      function( json ) {
        var data = json.conf;

        var attributes = Object.keys(data)
                          .filter(function( key ) {
                            return visible_keys.indexOf(key) != -1;
                          })
                          .map(function( key ) {
                            return {
                              key : key,
                              value: typeof data[key] == 'string' ? data[key] : JSON.stringify( data[key], null, 2)
                            };
                          });

        vm.attributes(attributes);
      });
  });

  return vm;
});