const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const expressSession = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const spotifyClientId = process.env.spotify_client_ID
const spotifyClientSecret = process.env.spotify_client_secret
// Session Configuration
app.use(
  expressSession({
    secret: spotifyClientSecret, // Replace with your actual secret key
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());



passport.use(
  new SpotifyStrategy(
    {
      clientID: spotifyClientId,
      clientSecret: spotifyClientSecret,
      callbackURL: 'http://localhost:3000/auth/spotify/callback', // Replace with your callback URL
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      // Handle user data and authentication here
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Authentication
app.get('/auth/spotify', (req, res) => {
  passport.authenticate('spotify')(req, res, () => {
    // You can handle user data here
    res.send('Authentication Successful');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
