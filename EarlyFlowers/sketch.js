
let data;
let imgLoc;
let className;
let img, img1;

async function setup() {

    const DEFAULTS = {
        version: 1,
        alpha: 0.25,
        topk: 3,
        learningRate: 0.0001,
        hiddenUnits: 100,
        epochs: 20,
        numLabels: 2,
        batchSize: 0.4,
        layer: 'conv_pw_13_relu',
    }
    mobilenet = await ml5.featureExtractor('MobileNet', modelReady);
    classifier = await mobilenet.classification();

    for (var i = 0; i < data.children.length; i++) {
        for (var j = 0; j < data.children[i].children.length; j++) {
            imgLoc = data.children[i].children[j].path;
            className = data.children[i].children[j].type;

            img = await createImg(imgLoc).hide();
            await img.size(224, 224);
            console.log(img);
            await classifier.addImage(img, className);

        }
    }

    await classifier.train(whileTraining);
    img1 = await createImg('website_can.jpg');
    await img1.size(224, 224);

    await classifier.classify(img1, (err, result) => console.log(result));
}


function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        //    classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}

//load model callback
function modelReady() {
    console.log('mobilenet model loaded');
}

//executes first
function preload() {
    data = loadJSON('json_ml5data.json', () => console.log('data loaded'));
}