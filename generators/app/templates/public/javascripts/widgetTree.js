define([
  'knockout'
],function(
  ko
){
  var NodeModel = function(data) {
  
    var self = this;
    
    self.isExpanded = ko.observable(true);
    self.description = ko.observable( data.description );
    self.name = ko.observable( data.name );

    self.toggleVisibility = function(vm, e) {
      e.stopPropagation();
      this.isExpanded(!this.isExpanded());
    };

    self.showContent =function(vm, e) {
      e.stopPropagation();
      // here fire change view events;
    };

    var nodes = [];
    data.nodes && data.nodes.forEach(function(node) {
      nodes.push(new NodeModel(node));
    });
    self.nodes = ko.observableArray(nodes);
  };
  
  var vm = {
    treeData : ko.observable()
  };

  vm.treeData( new NodeModel(
      {
        name: 'Root 1',
        description: 'test description!',
        objectId: '',
        nodes: [
          {
            name: 'Child 1',
            description: 'test description!',
            objectId: '',
            nodes: [
            ]
          },
          {
            name: 'Child 2',
            description: 'test description! asd',
            objectId: '',
            nodes: [
              {
                name: 'Child Child 1',
                description: 'test description!',
                objectId: '',
                nodes: [
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Root 2',
        description: 'this is a longer description and it is still fabulous',
        objectId: '',
        nodes: [
        ]
      },
      {
        name: 'Root 3',
        description: '',
        objectId: '',
        nodes: [
        ]
      }))
  return vm
});