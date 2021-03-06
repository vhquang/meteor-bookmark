Links = new Meteor.Collection('links');

// Session.set("selected-item", null);

var listHandle = Meteor.subscribe('links');


Template.main_panel.loading = function() {
  return !listHandle.ready();
}
;
Template.list_links.links = function() {
  return Links.find( {}, {sort:{created_at: -1}} ).fetch();
};



Template.link_item.edit = function() {
  return Session.equals("selected-item", this._id) ? "edit editing" : "edit";
};
Template.link_item.id = function() { 
  return this._id; 
};

Template.link_item.events({
  
  'click .destroy': function() {
    Links.remove(this._id);
  },

  'click .edit,.editing': function() {
    if ( Session.equals("selected-item", this._id) ) {
      Session.set("selected-item", null);
      return;
    }
    Session.set("selected-item", this._id);
  },

  'click .save': function() {
    updateLinkItem.call(this);
  }
});



Template.item_detail.editing = function() {
  return Session.equals("selected-item", this._id);
};
Template.item_detail.displayUrl = function() {
  var url = this.url;
  if (!url) { return ""; }
  url = url.indexOf("//") > 0 ? url.substr(url.indexOf("//") + 2) : url;
  url = url.indexOf("/") > 0 ? url.substr(0, url.indexOf("/")) : url;
  return url;
}

Template.item_detail.events({
  'click #copyTitle': function(evt) {
    copyToClipboard( evt.toElement.id );
  },
  'click #copyUrl': function(evt) {
    copyToClipboard( evt.toElement.id );
  }
});



var isBrowserSupportFlash = detectflash();
Template.editing_panel.supportFlash = isBrowserSupportFlash;
Template.editing_panel.rendered = function() {
  if ( Session.equals("selected-item", this.data._id) ) {
    var buttons_list = this.findAll("button[data-clipboard-text]");
    $.each(buttons_list, function(index, button) { 
      copyToClipboard( button.id );
    });
  }
};


Template.new_item.events({
  'click button': function() {
    var titleElement = document.getElementById('title_box');
    var urlElement = document.getElementById('url_box');
    Links.insert({
      title: titleElement.value,
      url: urlElement.value,
      created_at: new Date().getTime()
    });
    titleElement.value = "";
    urlElement.value = "";
  }
});



function updateLinkItem() {
  var title = document.getElementById('edit_title').value;
  var url = document.getElementById('edit_url').value;
  Links.update( this._id, {$set: {
    title: title, 
    url: url
  }});
  Session.set("selected-item", null);
}

function copyToClipboard(id) {
  var clipboard = new ZeroClipboard( document.getElementById(id) );
  clipboard.on( "load", function(clipboard) {
    clipboard.on( "complete", function(clipboard, args) {
      alert( args.text );
    } );

  } );
}

/* copy from:
   http://www.blangdon.com/writing/about/detect-flash-with-javascript/ */
function detectflash(){
  if (navigator.plugins != null && navigator.plugins.length > 0){
    return navigator.plugins["Shockwave Flash"] && true;
  }
  if(~navigator.userAgent.toLowerCase().indexOf("webtv")){
    return true;
  }
  if(~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")){
    try{
      return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
    } catch(e){}
  }
  return false;
}
