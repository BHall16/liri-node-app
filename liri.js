require("dotenv").config();

var spotify = new Spotify(keys.spotify);

var request = require('request');

var fs = require('fs');

var axios = require("axios");

axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")