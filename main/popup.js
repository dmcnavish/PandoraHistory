var visibleElementInterval=10;

window.onload = function(){
	var clearButton = document.getElementById("clearButton");
	clearButton.addEventListener("click",clearStorage,false);

	var moreButton = document.getElementById("moreButton");
	moreButton.addEventListener("click", showMore, false);
	
	loadSongs(true);
}

/**
 * Flush the Storage cache
 */
function clearStorage(){
	console.log('clearing storage');
	chrome.storage.local.remove('history',function(items){
		console.log('hisotry cleared');
	});

	historyList = document.getElementById('history');
	while(historyList.hasChildNodes){
		historyList.removeChild(historyList.lastChild);
	}
}

/**
 * Build a list item with the current song.
 */
function buildCurrentSongItem(currentSong){
	var item = document.createElement("li");
	var itemhtml = '<img src="'+ currentSong.albumnCover + '"/>'
	itemhtml += '<ul class="songHistory"><li>' + currentSong.song + '</li>'
	itemhtml += '<li>by ' + currentSong.artist + '</li>'
	itemhtml += '<li>' + currentSong.albumn + '</li></ul>'
	item.innerHTML = itemhtml;
	return item;
}

/**
 * Show the next x elements in the list
 */
function showMore(){
	loadSongs(false);
}

/**
 * Load the array of song history from the storage and construct a list where each song is a list item.
 * If the list already has items in it, append the new item to the end of the list
 */
function loadSongs(isInit){
	chrome.storage.local.get('history',function(data){
		var dh = data.history;
		var todaysHistory = []
		if(dh != null){
			todaysHistory = JSON.parse(dh);
		}
		console.log('loading saved history');
		if(todaysHistory.length == 0){
			console.log('no history for today');
			return;
		}	
		historyList = document.getElementById('history');
		hlLength=historyList.childNodes.length;
		if(hlLength == todaysHistory.length){
			moreButton = document.getElementById('moreButton');
			moreButton.disabled=true;
			console.log('There are no more songs to display');
			return;
		}
		console.log('historyList: ' + historyList + ' historyList.length: ' + hlLength);
		console.log("todaysHistory.length: " + todaysHistory.length);
		
		hlLength=historyList.childNodes.length;
		startingIdx=todaysHistory.length-1-hlLength;
		for(var i=startingIdx; i>startingIdx-visibleElementInterval && i>=0;i--){ 
			console.log('i: ' + i + ' todaysHistory[i]: ' + todaysHistory[i].song);
			var item = buildCurrentSongItem(todaysHistory[i]);
			historyList.appendChild(item);
		}
	});
}