$(document).ready(function (){
	$("#search-input").click(function() {
		console.log("1");
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $("#dvTable").offset().top
	    }, 2000);
	});

	$("#tablebtn").click(function() {
		console.log("2");
	    $([document.documentElement, document.body]).animate({
	        scrollTop: $("#dvTable").offset().top
	    }, 1000);
	});
	
	$('#div1').css({ opacity: 0 });
	$('#div2').css({ opacity: 0 });
	$('#div3').css({ opacity: 0 });
	$('#div4').css({ opacity: 0 });
	$('#div5').css({ opacity: 0 });

	// If search was clicked or return key was hit
	$('.icon').click(function(){
        /*if ($(this).data('count')) { // was clicked
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
		}*/
		$([document.documentElement, document.body]).animate({
	        scrollTop: $("#dvTable").offset().top
	    }, 4000);
		console.log("3");
		var value = $("#search-input").val();
		console.log(value);
		document.getElementById("search-input").setAttribute("value", "");

	});

	// Make return key same as if search icon was clicked
	$('#search-input').keypress(function(e) {
        if (e.which == 13) {
            $('.icon').trigger("click");
        }
	});
	
	$('.has-clear input[type="text"]').on('input propertychange', function() {
		var $this = $(this);
		var visible = Boolean($this.val());
		$this.siblings('.form-control-clear').toggleClass('hidden', !visible);
	  }).trigger('propertychange');
	  
	  $('.form-control-clear').click(function() {
		$(this).siblings('input[type="text"]').val('')
		  .trigger('propertychange').focus();
	});
	
});

