var prevDataLength;
var nextLine = 0;
var pollTimer;

function ajaxCall(url, onRow) {
  var x = new $.ajaxSettings.xhr();
  x.open("GET", url);
  var handleResponseCallback = function(){
    handleResponse(x, onRow);
  };
  x.onreadystatechange = handleResponseCallback;
  pollTimer = setInterval(handleResponseCallback, 1000);
  x.send(null);
};

function handleResponse(http, onRow) {
    if (http.readyState != 4 && http.readyState != 3)
        return;
    if (http.readyState == 3 && http.status != 200)
        return;
    if (http.readyState == 4 && http.status != 200) {
        clearInterval(pollTimer);
    }

    while (prevDataLength != http.responseText.length) {
        if (http.readyState == 4  && prevDataLength == http.responseText.length)
            break;
        prevDataLength = http.responseText.length;
        var response = http.responseText.substring(nextLine);
        var lines = response.split('\n');
        nextLine = nextLine + response.lastIndexOf('\n') + 1;
        if (response[response.length-1] != '\n')
            lines.pop();
        for (var i = 0; i < lines.length; i++) {
            try {
                var asJson = JSON.parse(lines[i]);
                onRow(asJson);
            } catch (e){}
          //$("body").append($("<p></p>").html(lines[i]));
        }
    }

    if (http.readyState == 4 && prevDataLength == http.responseText.length)
      clearInterval(pollTimer);

}