// // Daniel Shiffman
// // http://youtube.com/thecodingtrain
// // http://codingtra.in

// // Transfer Learning Feature Extractor Classification with ml5
// // https://youtu.be/eeO-rWYFuG0

let mobilenet;
let classifier;
let video;
let loss;
let label = 'test';
let img;
let flowerTyp;
let data;
let dataFlower = [];
let canvas;


let cancerScore;
let otherScore;


// // Change the status when the model loads.
function modelReady() {
  select('#status').html('Model Loaded')
}

// // Change the status when the model loads.
function jsonReady() {
  select('#status2').html('JSON Loaded')
}


// function setup() {
//   var c = createCanvas(244, 244);
//   background(100);
  c.drop(gotFile);
//   const options = { version: 1, epochs: 50 };
//   mobilenet = ml5.featureExtractor('MobileNet', options, modelReady);
//   classifier =  mobilenet.classification();
//   for (let n = 0; n < 5; n++) {
//     for (let i = 0; i < 22; i++) {
//       // Load the image
//       imgPfad = data.children[n].children[i].path;
//       flowerTyp = data.children[n].children[i].type;

//       console.log(imgPfad);


//       select('#pfad').html(imgPfad);
//       htmlPic = "<img src=\"" + imgPfad + "\">";
//       img = createImg(imgPfad).hide();
//       classifier.addImage(img, flowerTyp);
//       //console.log(imgPfad + " of type " + flowerTyp);
//     }
//   }





//   trainButton = createButton('train');
//   trainButton.mousePressed(function () {
//     classifier.train(whileTraining);
//   });

//   saveButton = createButton('save');
//   saveButton.mousePressed(function () {
//     classifier.save();
//     console.log('Custom Model saved!!');
//   });

//   loadButton = createButton('load');
//   loadButton.mousePressed(function () {
//     classifier.load('model.json');
//     console.log('Custom Model loaded');
//   });

//   testButton = createButton('test');
//   testButton.mousePressed(function () {
//     img = createImg('../img/Hohler_Lerchensporn/8.jpg', testModel);
//   });

//   function testModel() {
//     // Get a prediction for that image
//     classifier.classify(img, function (err, result) {
//       console.log(result);
//       select('#result').html(result);
//     });

//   }

function gotFile(file) {
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    var img = createImg(file.data, testModel).hide();
    // Draw the image onto the canvas
    image(img, 0, 0, width, height);
  } else {
    console.log('Not an image file!');
  }
}

//   function draw() {
//     fill(255);
//     noStroke();
//     textSize(12);
//     textAlign(CENTER);
//     text('Drag an image after loading Custom Model.', width / 2, height / 2);
//     noLoop();
//   }







let init = async () => {
  const options = { version: 1, epochs: 50 };

  loadJSON(async function (data) {
    data = JSON.parse(data);
    mobilenet = await ml5.featureExtractor('MobileNet', () => console.log('model is ready'));
    classifier = await mobilenet.classification();


    for (let n = 0; n < data.children.length; n++) {
      for (let i = 0; i < data.children[n].children.length; i++) {
        // Load the image

        try {
          imgPfad = data.children[n].children[i].path;
          flowerTyp = data.children[n].children[i].type;
        } catch (error) {
          console.log('done reading')
        }

        let myImage = new Image(224, 224);
        myImage.src = imgPfad;
        await classifier.addImage(myImage, flowerTyp);

        //console.log(myImage.src)
        //

      }

    }



    //training
    await classifier.train(function whileTraining(loss) {
      if (loss == null) {
        console.log('Training Complete');
        //    classifier.classify(gotResults);
      } else {
        console.log(loss);
      }
    });

    //classification 
    let img = new Image(224, 224);
    img.src = "/EarlyFlowers\\website.jpg";

    classifier.classify(img, function (err, result) {
      if (err)
        console.log(err);

      console.log(result)
      console.log(result[0].confidence);
      console.log(result[1].confidence);


      if (result[0].label === 'cancer' && result[1].label === 'others') {
        cancerScore = round(result[0].confidence, 10);
        otherScore = round(result[1].confidence, 10);
      } else {
        cancerScore = round(result[1].confidence, 10);
        otherScore = round(result[0].confidence, 10);
      }


      console.log(cancerScore + " " + otherScore)

      if (cancerScore > otherScore)
        console.log("CANCER !!!!")
      else
        console.log("SAFE !!!!")

    });

  });
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'json_ml5data.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}




init();
