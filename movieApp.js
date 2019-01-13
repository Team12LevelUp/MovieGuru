$(document).ready(function (){

	function get_movie_dictionary(query){
		dictionary = {};

		searchMovie(dictionary, query).then(function() {
			getDetails(dictionary);
		}).then(function () {
			getCredits(dictionary);
		}).then(function () {
			getRelease(dictionary);
		}).then(function () {
			getKeywords(dictionary);
		});

		return dictionary;
	}

	function searchMovie(dictionary, query){
		var deferred = $.Deferred();
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query="+query+"&language=en-US&api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		$.ajax(settings).done(function (response) {

			dictionary["id"]=response.results[0].id;
			dictionary["title"] = response.results[0].title;
			dictionary["poster_url"] = "http://image.tmdb.org/t/p/w500/" + response.results[0].poster_path;
			dictionary["language"] = response.results[0].original_language;
			dictionary["rating"] = response.results[0].vote_average;
			dictionary["release_date"] = response.results[0].release_date;
			dictionary["summary"] = response.results[0].overview;
			//return deferred.resolve();
		});
		return deferred.resolve();
	}

	function getKeywords(dictionary){
		var deferred = $.Deferred();
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary["id"]+"/keywords?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		}

		$.ajax(settings).done(function (response) {

			dictionary["tag"] = [];
			for (i = 0; i < response.keywords.length; i++) {
				dictionary["tag"].push(response.keywords[i].name);
			}
		});
		return deferred.resolve();
	}

	function getRelease(dictionary) {
		var deferred = $.Deferred();
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary["id"]+"/release_dates?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		}

		$.ajax(settings).done(function (response) {
			for (i = 0; i < response.results.length; i++) {
				if (response.results[i].iso_3166_1 === "US") {
					dictionary["mpaa_rating"] = response.results[i].release_dates[0].certification;
				}

			}
		});
		return deferred.resolve();
	}

	function getDetails(dictionary){
		var deferred = $.Deferred();
		var settings = {

			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary['id']+"?language=en-US&api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		var i;

		$.ajax(settings).done(function (response) {

			dictionary["genre"] = [];
			for (i = 0; i < response.genres.length; i++) {
				dictionary["genre"].push(response.genres[i].name);
			}
			dictionary['budget'] = response.budget;
			dictionary['imdb_id'] = response.imdb_id;

			dictionary["production_companies"] = [];
			for (i = 0; i < response.production_companies.length; i++) {
				dictionary["production_companies"].push(response.production_companies[i].name);
			}

			dictionary['homepage'] = response.homepage;
			dictionary['box_office'] = response.revenue;
			dictionary['runtime'] = response.runtime;
			return deferred.resolve();
		});

	}

	function getCredits(dictionary){
		var deferred = $.Deferred();
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary['id']+"/credits?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};
		var i, max;

		$.ajax(settings).done(function (response) {
			if (response.cast.length < 5){
				max = response.cast.length
			} else {
				max = 5
			}

			dictionary['actor'] = [];
			for (i=0; i < max; i++){
				dictionary['actor'].push(response.cast[i].name);
			}

			for(i=0; i < response.crew.length; i++) {
				if (response.crew[i].job === "Director") {
					dictionary['director'] = response.crew[i].name;
				}
			}
			return deferred.resolve();
		});

	}

		function addMovies(search_terms) {

			var terms = search_terms.split(',');

			console.log(search_terms);
			console.log(terms);

			var movies = new Array();
			
			for (var i = 0; i < terms.length; i++) {
				movies.push(get_movie_dictionary(terms[i]));
			}					

			setTimeout(function(){

				console.log(movies);

				//Create a HTML Table element.
				var table = document.createElement("TABLE");
				table.className = "table table-striped";
			
				var numFields = 5;
			
				//Add the header row.
				var row = table.insertRow(-1);

				var headerCell = document.createElement("TH");
				headerCell.innerHTML = ""
				headerCell.padding="0";
				row.appendChild(headerCell)

				var posterWidth = window.innerWidth / (7) - 10;

				for (var i = 0; i < movies.length; i++) {
					var headerCell = document.createElement("TH");
					headerCell.innerHTML = "";
					headerCell.padding="0";

					var img = document.createElement('img');
					img.src = movies[i]["poster_url"];
					img.padding="0";
					img.width= posterWidth;
					img.height=posterWidth*1.5;
					
					headerCell.appendChild(img);

					row.appendChild(headerCell);
				}

				//Add the data rows.
				row = table.insertRow(-1);
				var cell = row.insertCell(-1);
				cell.innerHTML = "Title";

				for (var i = 0; i < movies.length; i++) {
					var cell = row.insertCell(-1);
					cell.innerHTML = movies[i]["title"];
				}

				row = table.insertRow(-1);
				var cell = row.insertCell(-1);
				cell.innerHTML = "Release Date";

				for (var i = 0; i < movies.length; i++) {
					var cell = row.insertCell(-1);
					cell.innerHTML = movies[i]["release_date"];
				}
				

				row = table.insertRow(-1);
				var cell = row.insertCell(-1);
				cell.innerHTML = "User Rating";

				for (var i = 0; i < movies.length; i++) {
					var cell = row.insertCell(-1);
					cell.innerHTML = movies[i]["rating"];
				}

				row = table.insertRow(-1);
				var cell = row.insertCell(-1);
				cell.innerHTML = "Summary";

				for (var i = 0; i < movies.length; i++) {
					var cell = row.insertCell(-1);
					cell.innerHTML = movies[i]["summary"];
				}

				var dvTable = document.getElementById("dvTable");
				dvTable.innerHTML = "";
				dvTable.appendChild(table);

			}, 1000);

		}


		

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
		var value = $("#search-input").val();
		console.log(value);

		$("#search-input").val("");

		addMovies(value);

		$([document.documentElement, document.body]).animate({
	        scrollTop: $("#dvTable").offset().top
		}, 3000);

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

