$(document).ready(function (){

	searchMovie = async function(dictionary) {

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query="+dictionary["searchTerm"]+"&language=en-US&api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		await $.ajax(settings).done(function (response) {
			dictionary["id"]=String(response.results[0].id);
			dictionary["title"] = response.results[0].title;
			dictionary["poster_url"] = "http://image.tmdb.org/t/p/w500/" + response.results[0].poster_path;
			dictionary["language"] = response.results[0].original_language;
			dictionary["rating"] = response.results[0].vote_average;

			var options = {year: 'numeric', month: 'long', day: 'numeric' };
			var dateObject = new Date(Date.parse(response.results[0].release_date));
			dictionary["release_date"] = dateObject.toLocaleDateString("en-US", options);

			dictionary["summary"] = response.results[0].overview;
		});

		getDetails(dictionary);
	}

	getKeywords = async function(dictionary){

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary["id"]+"/keywords?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		await $.ajax(settings).done(function (response) {

			dictionary["tag"] = [];
			for (var i = 0; i < response.keywords.length; i++) {
				dictionary["tag"].push(response.keywords[i].name);
			}
		});
	}

	getRelease = async function(dictionary) {

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary["id"]+"/release_dates?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		await $.ajax(settings).done(function (response) {
			for (var i = 0; i < response.results.length; i++) {
				if (response.results[i].iso_3166_1 === "US") {
					dictionary["mpaa_rating"] = response.results[i].release_dates[0].certification;
				}

			}
		});

		getKeywords(dictionary);
	}

	getDetails = async function(dictionary) {

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary["id"]+"?api_key=07a7c9c75d334aae16ed5f47c759aa7e&language=en-US",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		await $.ajax(settings).done(function (response) {

			var num_genres = response.genres.length;
			dictionary["genres"] = "";
			for (var i = 0; i < num_genres - 1; i++){
				dictionary["genres"] = dictionary["genres"].concat(response.genres[i].name);
				dictionary["genres"] = dictionary["genres"].concat(", ");
			}
			dictionary["genres"] = dictionary["genres"].concat(response.genres[num_genres - 1].name);

			var formatter = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
			  });

			dictionary['budget'] = formatter.format(response.budget);
			dictionary['imdb_id'] = response.imdb_id;

			var num_companies = response.production_companies.length;
			dictionary["productionCompanies"] = "";
			for (var i = 0; i < num_companies - 1; i++){
				dictionary["productionCompanies"] = dictionary["productionCompanies"].concat(response.production_companies[i].name);
				dictionary["productionCompanies"] = dictionary["productionCompanies"].concat(", ");
			}
			dictionary["productionCompanies"] = dictionary["productionCompanies"].concat(response.production_companies[num_companies - 1].name);

			dictionary['homepage'] = response.homepage;
			dictionary['box_office'] = formatter.format(response.revenue);

			if (Math.floor(response.runtime / 60) == 0) {
				dictionary["runtime"] = String(response.runtime) + " minutes";
			} else if (Math.floor(response.runtime / 60) == 1) {
				dictionary["runtime"] = String(Math.floor(response.runtime / 60)) + " hour, " + String(response.runtime % 60) + " minutes";
			} else {
				dictionary["runtime"] = String(Math.floor(response.runtime / 60)) + " hours, " + String(response.runtime % 60) + " minutes";
			}
		});

		getCredits(dictionary);

	}

	getCredits = async function(dictionary){

		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://api.themoviedb.org/3/movie/"+dictionary['id']+"/credits?api_key=07a7c9c75d334aae16ed5f47c759aa7e",
			"method": "GET",
			"headers": {},
			"data": "{}"
		};

		await $.ajax(settings).done(function (response) {
			if (response.cast.length < 5){
				var max = response.cast.length;
			} else {
				var max = 5;
			}

			dictionary["actors"] = "";
			for (var i = 0; i < max - 1; i++){
				dictionary["actors"] = dictionary["actors"].concat(response.cast[i].name);
				dictionary["actors"] = dictionary["actors"].concat(", ");
			}
			dictionary["actors"] = dictionary["actors"].concat(response.cast[max].name);

			directors = [];
			for(var i = 0; i < response.crew.length; i++) {
				if (response.crew[i].job === "Director") {
					directors.push(response.crew[i].name);
				}
			}
			dictionary["directors"] = directors.join(", ");
		});

		getRelease(dictionary);

	}

		addMovies = async function(search_terms) {

			var terms = search_terms.split(',');

			var movies = new Array();

			for (var i = 0; i < terms.length; i++) {
				var movie = {};
				movie["searchTerm"] = terms[i];
				movies.push(movie);
			}
			
			for (var i = 0; i < movies.length; i++) {
				await searchMovie(movies[i]);
			}					

			console.log(movies);

			setTimeout(function(){
				drawTable(movies);
			}, 3000);
		}

		function drawTable(movies) {

			//Create a HTML Table element.
			var table = document.createElement("TABLE");
			table.className = "table table-striped";
			
			//Add the header row.
			var posterWidth = String(Number(window.innerWidth / (8))) + "px";
			console.log(posterWidth);

			var row = table.insertRow(-1);

			var headerCell = document.createElement("TH");
			headerCell.innerHTML = ""
			// headerCell.padding = "0";
			// headerCell.style.width = posterWidth;

			row.appendChild(headerCell)

			for (var i = 0; i < movies.length; i++) {
				var headerCell = document.createElement("TH");
				headerCell.innerHTML = "";
				// headerCell.padding = "0";
				// headerCell.style.width = posterWidth;

				var img = document.createElement('img');
				img.src = movies[i]["poster_url"];
				img.padding = "0";
				img.style.width = posterWidth;
				// img.height =posterWidth*1.5;
				
				headerCell.appendChild(img);

				row.appendChild(headerCell);
			}

			//Add the data rows.

			//Title
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Title";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["title"];
			}

			//Director
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Director";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["directors"];
			}
			
			//Actors
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Lead actors";

			for (var i = 0; i < movies.length; i++) {

				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["actors"];
			}

			//Runtime
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Runtime";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["runtime"];
			}

			//Genre
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Genres";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["genres"]
			}

			//Production Companies
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Production companies";

			for (var i = 0; i < movies.length; i++) {

				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["productionCompanies"];
			}

			//Release date
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Release date";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["release_date"];
			}

			//MPAA Rating
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "MPAA Rating";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["mpaa_rating"];
			}

			//Budget
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Budget (USD)";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["budget"];
			}

			//Box office
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "Box office (USD)";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["box_office"];
			}
			
			//User rating
			row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = "User rating";

			for (var i = 0; i < movies.length; i++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = movies[i]["rating"];
			}

			//Summary
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
		}

	// If search was clicked or return key was hit
	$('.icon').click(function(){

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
	
});

