require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var arg = process.argv;
var reference = [];
var theSong='';
var theMovie='';
var theBand='';
var filename = 'log.txt';
var fullCommand =[];


for (var i = 3; i < arg.length; i++) {
    reference.push(arg[i])
}

var referenceBand = reference.join("");

fullCommand.push(command);
if(reference.length != 0){
    fullCommand.push(referenceBand);
}


function logging(value){
    fs.appendFile(filename,','+ value, function(err) {
        if (err) {
            return console.log("oh no error")
        }
    })
}
logging(fullCommand);


if (command === 'concert-this') {
    concert(referenceBand);
} else if (command === 'spotify-this-song') {
    spotifySong(reference);
} else if (command === 'movie-this') {
    movie(reference);
} else if (command === 'do-what-it-says') {
    doThat();
}


function concert(referenceBand) {
    var bandUrl = "https://rest.bandsintown.com/artists/" + referenceBand + "/events?app_id=codingbootcamp";
    axios.get(bandUrl).then(
        function (response) {
            console.log("  ");
            console.log("********GETTING***BAND/ARTIST***INFO: "+referenceBand+"  ********");
            for (var i = 0; i < response.data.length; i++) {

                var datetime = response.data[i].datetime;

                var dateArr = datetime.split('T');

                var concertResults = 
                    ".................................................................." +
                    "\nVenue Name: " + response.data[i].venue.name +
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr[0], "YYYY-DD-MM").format('DD/MM/YYYY');

                console.log(concertResults);
            }   console.log("  ");
                console.log("*******************************************************  ");
                console.log("  ");
        })
        .catch(function (error) {
            console.log('This is the error: ' + error);
        });
}


function spotifySong(reference) {
    if(reference.length === 0){
        reference = "The Sign";
    }
    spotify
    .search({ type: 'track', query: reference })
    .then(function(response) {
        console.log("  ");
        console.log("******SPOTIFYING******"+reference+"*********");
        console.log("  ");
        for (var i = 0; i < 5; i++) {
            var spotifyResults = 
                ".................................................................." +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;
            
            console.log(spotifyResults);
        }
        console.log("  ");
        console.log("*******************************************************  ");
        console.log("  ");
    })
    .catch(function(err) {
        console.log(err);
    });
}


function movie(reference) {
    if(reference.length === 0) {
        reference = "mr nobody";
    }
    axios.get('http://www.omdbapi.com/?t=' + reference + '&plot=short&apikey=trilogy').then(
        function (response) {
            var rotten = response.data.Ratings[1]

            if (rotten === undefined) { rotten = "Not available" }
            else{ rotten = response.data.Ratings[1].Value;}
            console.log("  ");
            console.log("*******MOVIE***INFORMATION***FOR******"+response.data.Title+"**************");
            console.log("  ");

            var movieResults =
                "\n* Title: " + response.data.Title +
                "\n* Year: " + response.data.Year +
                "\n* IMDB Rating: " + response.data.Rated +
                "\n* Rotten Tomatoes Rating: " + rotten +
                "\n* Country Produced: " + response.data.Country +
                "\n* Language: " + response.data.Language +
                "\n* Plot: " + response.data.Plot +
                "\n* Actors: " + response.data.Actors +
                "\n " +
                "\n********************************************************* "+
                "\n ";
        console.log(movieResults);

        })
        .catch(function (error) {
            console.log('This is the error: ' + error);
        });
}


function doThat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        console.log('')
        console.log('----------------MENU--OF--CONTENT----------------')
        console.log('')
        for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i] === 'spotify-this-song'){
            theSong= dataArr[++i];
            console.log('------------SPOTIFYING-----------'+theSong+'---------')
            spotifySong(theSong);
        }else if (dataArr[i] === 'movie-this'){
            theMovie= dataArr[++i];
            console.log('-----------WATCH--THIS--MOVIE----------'+theMovie+'---------')
            movie(theMovie);
        }else if (dataArr[i] === 'concert-this'){
            theBand= dataArr[++i];
            console.log('--------------CHECK--OUT--THIS--BAND------------'+theBand+'----------')
            concert(theBand);
        } else { console.log("Sorry, this command is not accepted");
        }
        }
    })
}