Links = new Meteor.Collection('links');

// Session.set("selected-item", null);

Meteor.subscribe('links');


Template.list_links.links = function() {
  return Links.find( {}, {sort:{created_at: -1}} ).fetch();
};

Template.link_item.edit = function() {
  return Session.equals("selected-item", this._id) ? "editing" : "edit";
}
Template.link_item.id = function() { return this._id; }

Template.item_detail.editing = function() {
  return Session.equals("selected-item", this._id);
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


Template.link_item.events({
  
  'click .destroy': function() {
    Links.remove(this._id);
  },

  'click .edit,.editing': function() {
    if (Session.get("selected-item")) {
      Session.set("selected-item", null);
      return;
    }
    Session.set("selected-item", this._id);
  },

  'click .save': function() {
    updateLinkItem.call(this);
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