(function($) {

  $.fn.replaceNestedForms = function() {
    var newElement = $(this).get(0).outerHTML.replace(/^<div/, "<form").replace(/<\/div>$/, "</form>");
    $(this).replaceWith(newElement);
    alert("done");
  };
  
})(jQuery);