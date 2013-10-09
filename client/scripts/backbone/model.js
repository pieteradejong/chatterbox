$(function() {
  var Message = Backbone.Model.extend({
    data: {
      author: 'anonymous',
      createdAt: new Date(),
      content: 'sample text',
      room: 'lobby'
    }

  });

  var MessagesList = Backbone.Collection.extend({
    model: Message,
    initialize: function() {
      console.log("initializing.....");
      fetchMessages();
      setInterval(fetchMessages,1000);
    },
    fetchMessages: function () {
      console.log('Fetching....');
      $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          this.processMessages(data);
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    processMessages: function(data) {
      console.log(data);
    }
  });

  var User = Backbone.Model.extend({
    data: {
      username: 'anonymous',
      currentRoom: 'lobby'
    }
  });

});

/*      messageHistory: /*Message list?????*/
 /*     friendList: /* array or object */
