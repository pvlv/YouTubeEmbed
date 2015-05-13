(function(){
  if (!document.addEventListener || !window.JSON) return;

  fullRe = /(?:https?:\/\/)?(?:www\.)?youtube.com\/(watch|playlist)?(v|list)=([a-zA-Z0-9]+)/i
  shortRe = /(?:https?:\/\/)?youtu.be\/([a-zA-Z0-9]+)/i

  var parseURL = function(url) {
    var match = fullRe.exec(url);

    var type = 'watch';
    var id;
    if (match){
      type = match[1];
      id = match[3];
    } else {
      match = shortRe.exec(url);

      id = match[1];

      if (!match){
        return null;
      }
    }

    return {type: type, id: id}
  }

  var options = INSTALL_OPTIONS;

  var add = function(){
    for (var i=0; i < options.embeds.length; i++) {
      if (!options.embeds[i].url || !options.embeds[i].location || !options.embeds[i].location.selector) return;

      var info = parseURL(options.embeds[i].url);
      if (!info)
        continue;

      var embed = "//www.youtube.com/embed"

      if (info.type == "watch"){
        embed += "/" + info.id + "?";
      } else {
        embed += "?listType=playlist&list=" + info.id + "&";
      }

      if (options.embeds[i].autoplay){
        embed += "autoplay=1"
      }

      var el = Eager.createElement(options.embeds[i].location);
      el.innerHTML = '<iframe type="text/html" width="640" height="390" src="' + embed + '" frameborder="0"/>'
    }
  }

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', add);
  else
    add();
})()