// Links -- {title: String, url: String, create_at: Date}
Links = new Meteor.Collection('links');

Meteor.startup(function () {
  
  Meteor.publish('links', function() {
    return Links.find();
  });

});