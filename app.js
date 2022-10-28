require("dotenv").config();

const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require("express-ejs-layouts");
//const ejs = require("ejs");
// EJS

//const res = require("express/lib/response");
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const ApiQuery = {
        artists: data.body.artists.items,
      };
      res.render("artist-search-results", ApiQuery);
      console.log(ApiQuery);
      console.log(ApiQuery.artists[0].images[0]);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
