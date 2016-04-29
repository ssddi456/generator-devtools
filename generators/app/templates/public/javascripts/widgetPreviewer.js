define([
  'underscore',
  'knockout'
],function(
  __,
  ko
){

  var vm = {
    width : ko.observable('100%'),
    height : ko.observable('480'),
    src : ko.observable(''),
  };



  vm.src.subscribe(function( v ) {
    setTimeout(function() {
      resize();
      window['previewer-iframe'].src = v;
    }, 100);
  });


  function format_size( val ) {
    val = String(val);
    if( val.trim().match(/[^\d]$/) ){
      return val;
    }
    return val + 'px';
  }

  var resize = _.debounce(function() {
    var width = vm.width();
    var height= vm.height();

    var previewer_iframe = window['previewer-iframe'];

    previewer_iframe.style.width = format_size(width);
    previewer_iframe.style.height = format_size(height);
  });

  vm.width.subscribe(resize);
  vm.height.subscribe(resize);

  return vm;
});