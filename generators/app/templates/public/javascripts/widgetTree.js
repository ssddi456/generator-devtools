define([
  './widgetPreviewer',
  'underscore',
  'knockout'
],function(
  widgetPreviewer,
  __,
  ko
){
  var NodeModel = function(data) {
  
    var self = this;
    
    self.isExpanded = ko.observable(true);
    self.description = ko.observable( data.description );
    self.name = ko.observable( data.name );

    self.href = data.href;
    self.unvisitable = data.unvisitable;

    self.toggleVisibility = function(vm, e) {
      e.stopPropagation();
      this.isExpanded(!this.isExpanded());
    };

    self.showContent =function(vm, e) {
      e.stopPropagation();
      if( self.href ){
        var path = self.href;
      } else if( self.unvisitable ){
        return;
      } else {

        // here fire change view events;
        // 
        var path = 'http://' + location.host + '/' + vm.description().replace(/\\/g,'/');
      }

      widgetPreviewer.src(path);
    };

    var nodes = [];
    data.nodes && data.nodes.forEach(function(node) {
      nodes.push(new NodeModel(node));
    });
    self.nodes = ko.observableArray(nodes);
  };
  
  var tab = function( data ) {
    this.name = ko.observable(data.name);
    this.selected = ko.observable(!!data.selected);
  };

  var vm = {
    treeData : ko.observable(),
    tabs : ko.observableArray([new tab({ name : 'source', selected : true }), new tab({ name : 'dest'})]),
    select: function( _vm ) {
      if( _vm.selected() ){
        return;
      }

      sync_file_tree(_vm.name());

      vm.tabs().forEach(function( _vm ) {
        _vm.selected( false );
      });

      _vm.selected(true); 
    }
  };

  function file_arr_to_file_tree( nodes ) {
    var tree_node_map = {};
    nodes.forEach(function( node ) {
      tree_node_map[node.description] = node;
      node.nodes = [];
    });

    nodes.forEach(function( node ) {
      tree_node_map[node.directory] && tree_node_map[node.directory].nodes.push(node);
    });
    return tree_node_map;
  }

  var sync_file_tree = _.debounce(function( type ) {
    $.getJSON('/tree?type=' + type, function( data ) {
      var node_map = file_arr_to_file_tree( data.items );

      vm.treeData(
        new NodeModel({ 
          nodes : data.roots.map( function( root ) {
                    return node_map[root];
                  }) 
          })
      );
    });
  },300);

  sync_file_tree('source');

  return vm;
});