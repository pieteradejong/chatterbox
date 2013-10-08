var latestMessageTimestamp = 0;
var username = window.location.search.split('=')[1];

var displayMessages = function (data,hasRun) {
  _(data).each(function(message) {
    var msgClean,thisDate,messageString, msgTimestamp;
    msgTimestamp = (new Date(message.createdAt)).getTime();
    if (msgTimestamp > latestMessageTimestamp) {
    // newer messages get displayed:
      thisDate = message.createdAt.toString().slice(11,16);
      if (message.text !== undefined) {
        msgClean = message.text.replace("<script>", "");
        msgClean = msgClean.replace("</script>", "");
        // msgClean.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;'').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
      }

      messageString = "<li class='message'>";
      messageString += "<span class='username'>" + message.username + "</span>";
      messageString += "<span class='room'> (in room " + message.roomname + ")</span>";
      messageString += "<span class='content'> " +msgClean + "</span>";
      messageString += "<span class='date'>" + thisDate + "</span>";
      messageString += "</li>";

      if (hasRun === false) {
        $('#chatbox').append(messageString);
      } else {
        $("#chatbox").prepend(messageString);
      }
    }
  });
  hasRun = true;
  latestMessageTimestamp = (new Date(data[0].createdAt)).getTime();
  // console.log("latestMT="+latestMessageTimestamp);
};

var updateMessages = function(hasRun) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt',
      limit: 25},
    success: function (data) {
//      console.log(data.results.length);
      displayMessages(data.results,hasRun);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

var sendMessage = function(username, msg) {
  console.log("sending message");
  var message = {
    username: username,
    text: msg,
    roomname: 'thisroom'
  };
  $.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(msg),
  contentType: 'application/json',
  success: function (response) {
    console.log('chatterbox: Message sent');
  },
  error: function (response) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
};


var run = function() {
  var hasRun = false;
  updateMessages(hasRun);
  setInterval(function() {
    updateMessages(hasRun);
  }, 1000);
};


run();