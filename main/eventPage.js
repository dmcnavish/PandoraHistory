var pollInterval = localStorage["pollInterval"] || 2;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "received request from tab:" + sender.tab.url : "received request from the extension");

    if (request.greeting == "song-change"){

    	storeSong(request.art, request.song, request.artist, request.album);
        sendResponse({farewell: "History Saved Successful", pollInterval: pollInterval});
    }
    else{ sendResponse({}); }
});


/**
 * Store a song within a list in local storage to be retrieved later.  
 * If the local storages's limit is approaching, remove the oldest song in the list.
 */
function storeSong(albumnCover, song, artist, albumn){
	console.log('adding song to storage');
	var currentSong = new Object();
	currentSong.albumnCover = albumnCover;
	currentSong.song = song;
	currentSong.artist = artist;
	currentSong.albumn = albumn;
	
	var todaysHistory = [];
	chrome.storage.local.get("history", function(data){
		console.log('after retrieving history from storage');
		var todaysHistory=[];
		if(data != null && data.history != null){
			todaysHistory = JSON.parse(data.history);
		}
		todaysHistory.push(currentSong);
		
		chrome.storage.local.getBytesInUse(null,function(b){
			console.log('bytes in use: ' + b + ' max bytes: ' + chrome.storage.local.QUOTA_BYTES);	
			if((b+500 > chrome.storage.local.QUOTA_BYTES)){
				console.log('removing first item because list is too big')
				todaysHistory.splice(0,1);
			}
			chrome.storage.local.set({'history': JSON.stringify(todaysHistory)},function(){
				//console.log('saved to storage: ' + todaysHistory);
				});	
		});
	});
}