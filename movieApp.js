$(document).ready(function (){
	$("#start").click(function() {
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $("#mainform").offset().top
	    }, 2000);
	});
});