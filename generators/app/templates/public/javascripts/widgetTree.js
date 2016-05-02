define([
  './widgetConfig',
  './widgetPreviewer',
  'underscore',
  'knockout'
],function(
  widgetConfig,
  widgetPreviewer,
  __,
  ko
){


  var node_detail_url = '/node_source';

  var NodeModel = function(data) {
  
    var self = this;
    
    self.isExpanded = ko.observable(true);
    self.description = ko.observable( data.description );
    self.name = ko.observable( data.name );

    self.type = data.type;
    self.root = data.root;
    self.href = data.href;

    self.toggleVisibility = function(vm, e) {
      e.stopPropagation();
      this.isExpanded(!this.isExpanded());
    };

    self.showContent =function(_vm, e) {
      e.stopPropagation();
      if( self.type == 'directory' ){
        return;
      }

      if( self.href ){
        var path = self.href;
        var path = 'http://' + location.host + vm.node_detail_url + '?' + $.param({ node_path : self.description(), root : self.root });
      } else {
        // here fire change view events;
        var path = 'http://' + location.host + vm.node_detail_url + '?' + $.param({ node_path : self.description(), root : self.root });
      }

      if( vm.active_tab_name == 'source' ){
        widgetConfig.node(_vm);
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
    node_detail_url : '/node_source',
    active_tab_name : 'source',
    tabs : ko.observableArray([new tab({ name : 'source', selected : true }), new tab({ name : 'dest'})]),
    select: function( _vm ) {
      if( _vm.selected() ){
        return;
      }

      sync_file_tree(_vm.name());

      vm.node_detail_url = '/node_' + _vm.name();
      vm.active_tab_name = _vm.name();

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