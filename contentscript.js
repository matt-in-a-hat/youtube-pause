
(function() {

	var videoElements = document.getElementsByTagName('video');

	if (videoElements.length < 1) {
		console.error("Couldn't find HTML5 video tag, has it loaded in flash instead?");
	} else {
		if (videoElements.length > 1) {
			console.warn("Multiple video elements found, using first.");
		}
		var video = videoElements[0];
		video.pause();
	}

})();