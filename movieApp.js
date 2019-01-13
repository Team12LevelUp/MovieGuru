$(document).ready(function (){
	$("#search-input").click(function() {
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $(".display-4").offset().top
	    }, 2000);
	});

	$("#tablebtn").click(function() {
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $("#dvTable").offset().top
	    }, 4000);
	});
	
	$('#div1').css({ opacity: 0 });
	$('#div2').css({ opacity: 0 });
	$('#div3').css({ opacity: 0 });
	$('#div4').css({ opacity: 0 });
	$('#div5').css({ opacity: 0 });

	// If search was clicked or return key was hit
	$('.icon').click(function(){
        if ($(this).data('count')) { // was clicked
            $(this).data('count', $(this).data('count') + 1); // add one
        } else { // no clicks
            $(this).data('count', 1); // initialize the count
        }
        if ( $(this).data('count')==1){
        	$('#div1').css({ opacity: 1 });
        } else if ( $(this).data('count')==2){
        	$('#div2').css({ opacity: 1 });
        } else if ( $(this).data('count')==3){
        	$('#div3').css({ opacity: 1 });
        } else if ( $(this).data('count')==4){
        	$('#div4').css({ opacity: 1 });
        } else {
        	$('#div5').css({ opacity: 1 });
        }
	});

	// Make return key same as if search icon was clicked
	$('#search-input').keypress(function(e) {
        if (e.which == 13) {
            $('.icon').trigger("click");
        }
    });
	
});

