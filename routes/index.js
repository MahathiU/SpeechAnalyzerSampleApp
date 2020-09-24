var express = require('express');
var router = express.Router();
var request = require('request');
var querystring =  require('querystring')

router.post('/', function(req, res, next) {
  console.log("I was called with POST method");
  let audio_file = req.files.speech_audio_file;
  audio_file.mv('./user_uploads/' + audio_file.name)
  console.log('Saved the file');

//   --form 'text=apple' \
// --form 'user_audio_file=@/Users/shimiz/speechace_dev/audio/misc/apple.wav' \
// --form 'question_info='\''u1/q1'\'''
  //https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module
  var form = {
    text: req.body.text,
    question_info : "'u1/q1'",
    user_audio_file : './user_uploads/' + audio_file.name
  }

  var formData = querystring.stringify(form);
  var contentLength = formData.length;

  var options = {
    url: 'https://api.speechace.co/api/scoring/text/v0.5/json?key={{speechacekey}}&dialect=en-us&user_id=XYZ-ABC-99001',
    method: 'POST',
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.status(200).send(body);
    } else {
      console.log('Something failed');
      res.status(500).send(body);
    }
  }

  request(options, callback);
  console.log('Completed what I had to complete')

});



module.exports = router;
