$(function() {

  var MessagesView = Backbone.View.extend({
    el: $('#messages'), // attaches `this.el` to an existing element.

    initialize: function(){
      _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
      this.render(); // not all views are self-rendering. This one is.
      // this.model.bind('sync', successCallback);
      this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
      $(this.el).append("<li>Hello World</li>");
    }
  });

  var messagesView = new MessagesView();

  var InputView = Backbone.View.extend({
    el: $('#main'),

    initialize: function () {
      this.listenTo(model,'change', this.render);
    },

    render: function() {

    }
  });

});