var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Track = require('./api/models/trackModel'),
    artist = require('./api/models/artistModel'),
    label = require('./api/models/labelModel');

mongoose.connect('mongodb://localhost/talentmine');

app.use(express.static(__dirname+'public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/tracks', function(req, res) {
    Track.find({}).exec().then(function(tracks) {
        res.send(tracks);
    })
});
app.post('/api/tracks', function(req, res) {
    Track.create({
        name: req.body.name,
        genre: req.body.genre
    }, function(err, new_track) {
        res.send(new_track);
        res.send(err);
    });
});
app.get('/api/tracks/:track_id', function(req, res) {
    Track.findOne({_id: req.params.track_id})
    .populate('artists')
    .exec().then(function(track) {
        if (!track) {
            return res.sendStatus(404);
        }
        return res.send(track);
    });
});

app.put('/api/tracks/:track_id', function(req, res) {
    Track.findByIdAndUpdate(req.params.track_id, req.body, {new:true}, function(err, resp) {
        if (err) return res.sendStatus(500);
            return res.send(resp);
    });
    return res.send()
});
app.delete('/api/tracks/:track_id', function(req, res) {
    Track.findByIdAndRemove(req.params.track_id, function(err, resp) {
        if (err) return res.sendStatus(500);
            return res.send(resp);
    });
});

app.put('/api/tracks/:track_id/artists/:artist_id', function(req, res) {
    Track.findByIdAndUpdate(req.params.track_id, {$push: {artists: req.params.artist_id}}, {new: true}, function(err, new_track) {
        if (err) {
            return res.sendStatus(500);
        }
        else {
            return res.send(new_track);
        }
    });
});

app.get('/api/artists', function(req, res) {
    Artist.find({req.params});
});
app.get('/api/artists/:artist_id', function(req, res) {

});

app.post('/api/artists/:artist_id/tracks/:track_id', function(req, res) {
    Artist.findByIdAndUpdate(req.params.artist_id, {$push: {artists: req.params.track_id}}, {new: true}, function(err, new_artist) {
        if (err) {
            return res.sendStatus(500);
        }
        else {
            return res.send(new_artist);
        }
    });
});


app.get('/api/labels', function(req, res) {

});
app.get('/api/labels/:label_id', function(req, res) {

});

app.listen(8080);
