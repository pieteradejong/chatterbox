var latestMessageTimestamp = 0;
var username = window.location.search.split('=')[1];
var listOfRooms = [];
var hasRun = false;
var room = 'lobby';

var displayMessages = function (data) {
  _(data).each(function(message) {
    var msgClean,thisDate,messageString,msgTimestamp;
    msgTimestamp = (new Date(message.createdAt)).getTime();
    // newer messages get displayed:
    thisDate = message.createdAt.toString().slice(11,16);
    if (message.text !== undefined) {
      msgClean = message.text.replace("<script>", "");
      msgClean = msgClean.replace("</script>", "");
      msgClean.replace(/\&/g, '&amp;').replace(/\>/g,'&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#039;');
      // msgClean.replace(/\</g, '&lt;');
    }

    if (message.username === username) {
      messageString = "<li class='message user'>";
    } else {messageString = "<li class='message'>";}

    messageString += "<span class='username'>" + message.username + "</span>";
    messageString += "<span class='room'> (in room " + message.roomname + ")</span>";
    messageString += "<span class='content'> " +msgClean + "</span>";
    messageString += "<span class='date'>" + thisDate + "</span>";
    messageString += "</li>";

    if (listOfRooms.indexOf(message.roomname) === -1) {
      listOfRooms.push(message.roomname);
    }

    if (hasRun === false) {
      if (msgTimestamp > latestMessageTimestamp) {
        $('#chatbox').append(messageString);
      }
    // } else if (room !== 'lobby') {
    //     if (msgTimestamp > latestMessageTimestamp && message.roomname === room) {
    //       $("#chatbox").prepend(messageString);
    //     }
    } else {
        if (msgTimestamp > latestMessageTimestamp) {
          $("#chatbox").prepend(messageString);
        }
    }
  });
  hasRun = true;
  latestMessageTimestamp = (new Date(data[0].updatedAt)).getTime();
};

var updateMessages = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt',
      limit: 25},
    success: function (data) {
      displayMessages(data.results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

var sendMessage = function(username, msg) {
  console.log("sending message");
  // room = room || 'default';
  var message = {
    username: username,
    text: msg,
    roomname: room
  };
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
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

var alreadyDisplayed = [];
var updateRooms = function() {
  _.each(listOfRooms, function(val, key, listOfRooms){
    if (alreadyDisplayed.indexOf(val) === -1) {
      $("#rooms").append("<li><a href='' onclick='return false'>" + val + "</a></li>");
      alreadyDisplayed.push(val);
    } else {
    }
  });
};

var run = function() {
  updateMessages(false);
  setInterval(function() {
    updateMessages(true);
    updateRooms();
  }, 1000);
};


run();