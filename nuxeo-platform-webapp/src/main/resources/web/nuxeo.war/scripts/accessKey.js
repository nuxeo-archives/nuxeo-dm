function showAccessKeys() {
    if (jQuery(".accessKeyMenu").size()>0) {
        jQuery(".accessKeyMenu").remove();
        return;
    }
    var container = jQuery("<div></div>");
    container.css("display","none");
    var div = jQuery("<div></div>");
    div.attr("id","accessKeyMenuPopup");
    div.addClass("accessKeyMenu");
    div.css({"padding":"8px", "margin":"4px", "font-size" : "12px"});              
    container.append(div);

    var table = jQuery("<table></table>");
    div.append(table);

    jQuery("[accesskey]").each(function() {
        var item = jQuery(this);
        var key = item.attr("accesskey");


        if (key !=null && key !="") {              
              var row = jQuery("<tr></tr>");
              var keySpan = jQuery("<span>" + key + "</span>");                 
              keySpan.css({"background-color":"#666666", "color":"white","padding":"3px", "margin":"2px","border-radius" : "2px", "font-size" : "12px"});              

              var keyText = this.innerHTML;
              if (this.tagName=="INPUT" && this.attr("type")=="button") {
                 keyText = this.attr("value");
              }
              if (keyText) {
                var td = jQuery("<td></td>");
                td.css({"padding":"2px"});
                td.append(keySpan);
                row.append(td);

                var descSpan = jQuery("<span></span>");
                descSpan.append(keyText);

                td = jQuery("<td></td>");
                td.append(descSpan);
                row.append(td);

                table.append(row);
              }
         }
    });
    jQuery("body").append(container);
    showFancyBox("#accessKeyMenuPopup");
}
jQuery(document).bind('keydown', 'Shift+h', showAccessKeys);

