if (document.location.host == 'outsidestory.de') {
	var piwikTracker = Piwik.getTracker("http://piwik.outsidestory.de/piwik.php", 1);
	piwikTracker.trackPageView();
	piwikTracker.enableLinkTracking();
}