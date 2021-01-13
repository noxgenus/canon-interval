// -------------------------------------------------------------------------------
// VWR PI3B NODEJS CANON INTERVAL NETWORK CONTROLLER
// V1.1 FOR RASBIAN BUSTER
// -------------------------------------------------------------------------------


const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const { exec } = require('child_process');
const Jimp = require('jimp');

server.listen(8081); 

// VARS
var frontData;
var snap = 0;
var error = 0;
var debug = 0;
var camID;
var snapit;
var rawpic;

var filename = "canon_picture";
var completeFilename;
var filename2 = "canon_picture_cropped";

//var intervalCanon = 1800000; // x1000 once per half hour
var intervalCanon = 30000; // x1000 once per half hour


var sequence;

 
// CANON ==================================== CANON GPHOTO WRAPPER


var fs = require('fs');
var gphoto2 = require('gphoto2');
var GPhoto = new gphoto2.GPhoto2();
var camera;

// Negative value or undefined will disable logging, levels 0-4 enable it.
if (debug == 1){
	GPhoto.setLogLevel(1);
 	GPhoto.on('log', function (level, domain, message) {
 		console.log(domain, message);
	});
}

// List cameras / assign list item to variable to use below options
GPhoto.list(function (list) {
	
  if (list.length === 0){
      console.log('Camera not found! - restart script');
  }

 	camera = list[0];
 	console.log('Found', camera.model);
 	// get configuration tree
  	camera.getConfig(function (er, settings) {
		if (debug == 1){ console.log(settings); }
 	});
});


// READ SEQUENCE NUMBERING ===========================================

fs.readFile("seq.txt", function(err, buf) {
  console.log("current sequence index:" + buf.toString());

  sequence = parseInt(buf);
});


// EXPRESS ===========================================================

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/*', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'frontend')});
});

/**/

// MAIN INTERVAL

setInterval(function(){ 

    if (snap == 1) {
      shoot();
    }

 }, intervalCanon);



// INCOMING DATA FROM FRONT END BUTTON
io.sockets.on('connection', function (socket) {
  socket.on('shootit', function (data) {

    error = 0;
    snap = data.value; 

    if (snap == 0) {
      io.sockets.emit('shootfeedback', {cam: 0, snap: 0}); 
      console.log("stopping interval");
    } else if (snap == 1){
      io.sockets.emit('shootfeedback', {cam: 0, snap: 3}); 
      console.log("starting interval");
    }

  });
      socket.on('disconnect', function () {
        console.log("Disconnected local");
        error = 1;
    });
});


// SHOOT FUNCTION

function shoot(){

    sequence = sequence +1;

    fs.writeFile("seq.txt", sequence, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written sequence number to file.");
    });


     console.log("Shooting...");

     completeFilename = filename + sequence + '.jpg';

      camera.takePicture({
          targetPath: '/tmp/foo.XXXXXX'
        }, function (er, tmpname) {
          if (tmpname != undefined){
            fs.rename(tmpname, __dirname + '/frontend/photos/' + completeFilename, function(err) {
              if(err) {
                return console.log(err);
              }

                console.log("Photo saved locally");


                io.sockets.emit('shootfeedback', {cam: 0, snap: 1, filename: completeFilename}); 
                console.log(completeFilename);

                setTimeout(function(){ moveit();}, 3000); // wait for frontend to cache image before moving!
                
              });
          }
      });
      return true;
}


function moveit(){
          exec('mv -v /home/magic/canoninterval/frontend/photos/* /media/photoswapquad/', (err, stdout, stderr) => {
                    if (err) {
                       console.log("Exec move file error");
                      return;
                    }
                    console.log("Photo moved to mounted share");

                  });
}


console.log("Canon Controller Running...");






// NODE EXIT HANDLER
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

process.stdin.resume();

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean and exit!');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();

}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
