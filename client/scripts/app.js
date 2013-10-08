// setInterval(function() {
//   $.ajax({
//   // always use this url
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'GET',
// //  data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     process(data.results);
//   },
//   error: function (data) {
//     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });},1000);

// var process = function(data) {
//   displayMessages(data);
//   setInterval(function(data) {
//     displayMessages(data);
//   },1000);
// };

var displayMessages = function (data, latestMessageTimestamp) {
  var latestMessageTimestamp = latestMessageTimestamp || new Date();
  _(data).each(function(message) {
    var msgTimestamp = message.createdAt.getTime();
    if (msgTimestamp < latestMessageTimestamp) {
      // continue;
    } else {
      var msgClean;
      console.log(data);
      var thisDate = message.createdAt.toString().slice(11,16);
      if (message.text !== undefined) {
        msgClean = message.text.replace("<script>", "");
        msgClean = msgClean.replace("</script>", "");
      }

      var messageString = "<div>" + message.username +
      " in room " + message.roomname + ": " +
      msgClean + "(" + thisDate + ")" + "</div>";
      $("#main").append(messageString);

      latestMessageTimestamp = message.createdAt.getTime();
    }
    // var latestMessage=
  });
};

var updateMessages = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      displayMessages(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};


var run = function() {
  updateMessages();
  displayMessages();
  setInterval(function() {
    updateMessages();
    displayMessages();
  }, 1000);
};


run();