require([
  'knockout',
  './widgetTree',
  './widgetPreviewer'
],function(
  ko,
  widgetTree,
  widgetPreviewer
){


  var vm = {
    widgetPreviewer : widgetPreviewer,
    widgetTree : widgetTree,
  };


  ko.applyBindings(vm);
});