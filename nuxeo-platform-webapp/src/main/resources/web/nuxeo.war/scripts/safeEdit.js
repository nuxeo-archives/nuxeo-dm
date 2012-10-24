
function getInputValue(domInput) {
   if (domInput.tagName == "INPUT") {
     if (domInput.type == 'text' || domInput.type == 'hidden') {
       return domInput.value;      
     } else if (domInput.type == 'radio' || domInput.type == 'checkbox') {
       return domInput.checked;      
     } 
   }
   else if (domInput.tagName == "SELECT" ) {
     return jQuery(domInput).val();
   }
   else if (domInput.tagName == "TEXTAREA" ) {
     return jQuery(domInput).val();
   }
   else if (domInput.tagName == "IFRAME" ) {
     return jQuery(domInput).contents().find("body").html();
   }

   //console.log("no value for " + domInput.tagName +" " + + domInput.type, domInput);
}

function setInputValue(domInput, value) {

   if (domInput.tagName == "INPUT") {
     if ( domInput.type == 'text' || domInput.type == 'hidden') {
       domInput.value = value;      
     }
     else if (domInput.type == 'radio' ) {      
       domInput.checked = value;
     } else if ( domInput.type == 'checkbox' ) {
       if (value==true) {
          domInput.checked = true;
       } else {
          jQuery(domInput).removeAttr("checked");
       }
     }
   } else if (domInput.tagName == "SELECT" || domInput.tagName == "TEXTAREA" ) {
     jQuery(domInput).val(value);      
   } else if (domInput.tagName == "IFRAME" ) {
     return jQuery(domInput).contents().find("body").html(value);
   }
}

function mustSkipField(field) {
   if (field.type=='button' || field.type=='submit') {
     return true;
   }
   if (field.name=='javax.faces.ViewState') {
     return true;
   }
   return false;
}

var blockAutoSave=false;
var lastSavedJSONData = null;

function saveForm(key, formSelector) {
    saveForm(key, formSelector, 0, null);
}

function getFormItems(formSelector) {
  return jQuery(formSelector).find("input,select,textarea,td.mceIframeContainer>iframe");
}

function saveForm(key, formSelector, savePeriod, saveCB) {
   var data={};
   getFormItems(formSelector).each( function() {
      if (!mustSkipField(this)) {
         data[this.name]=getInputValue(this);
      }
   });
   //console.log("savingForm", data);
   var dataToStore = JSON.stringify(data);
   if (dataToStore == lastSavedJSONData) {
     //console.log("skip save ... no change");     
   }
   else {
     localStorage.setItem(key,dataToStore);
     lastSavedJSONData = dataToStore;
     if (saveCB!=null) {
      saveCB(data);
     }
   }
   if (savePeriod>0 && !blockAutoSave) {
      window.setTimeout(function(){saveForm(key,formSelector,savePeriod, saveCB)}, savePeriod);
   }
   return data;
}

function cleanupSavedData(key) {
   //console.log("Cleanup custom storage");
   localStorage.removeItem(key);
}

function restoreDraftFormData(key, formSelector, loadCB, savePeriod, saveCB) {
   var dataStr=localStorage.getItem(key);
   if (dataStr) { // there is some saved data 

     // create cleanup callback
     jQuery(window).unload(function() { 
       // XXX
     });
     // block auto save until use choose to restore or not
     blockAutoSave = true;
     // build load callback that UI will call if user wants to restore
     var doLoad = function(confirmLoad) {
       if (confirmLoad) {
         // restore !
         var data = JSON.parse(dataStr);
         getFormItems(formSelector).each( function() {
         if (!mustSkipField(this)) {          
             setInputValue(this,data[this.name]);
         }
         });     
       } else {
         // drop saved data !
         cleanupSavedData(key);
       }
       blockAutoSave = false;
       window.setTimeout(function(){saveForm(key,formSelector,savePeriod, saveCB)}, savePeriod);
     };
     if (loadCB!=null) {
       if (!loadCB(doLoad)) {         
         return;
       }
     } else {
       doLoad();
     }    
  } else {
    saveForm(key, formSelector, savePeriod, saveCB);
  }   
}

function bindOnChange(formSelector) {

  getFormItems(formSelector).each( function() {
    var targetDomItem = jQuery(this);
    if (this.tagName=="IFRAME") {
      targetDomItem = jQuery(this).contents().find("body");
    }
    targetDomItem.change(function (event) { console.log("change", event);});
  });     

}

function initSafeEdit(key, formSelector, savePeriod, saveCB, loadCB) {   
   restoreDraftFormData(key, formSelector, loadCB, savePeriod, saveCB);   
}


