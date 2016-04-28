define([
  'knockout'
],function(
  ko
){
  var vm = {
    width : ko.observable(320),
    height : ko.observable(480),
    src : ko.observable(''),
  };
  return vm;
});