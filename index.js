const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');
const knn = new KNN();

const csvFilePath = 'irisData.csv'; //Data 
const names = ['sepalLength',
    'sepalWidth',
    'petalLength',
    'petalWidth',
    'type'
]; //For header

let seperationSize; //To seperate the training and test data

let data = [],
    X = [],
    y = [];

let trainingSetX = [],
    trainingSety = [],
    testSetX = [],
    testSetY = [];

csv({ noheader: true, headers: names })
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
        data.push(jsonObj); //push each object to data Array
    })
    .on('done', (error) => {
        seperationSize = 0.8 * data.length;
        data = shuffleArray(data);
        dressData();
    });

/**
 * Randomize array element order in-place.
 * https://stackoverflow.com/a/12646864
 * Using Durstenfeld shuffle algorithm.
 */

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function dressData() {
    /**
     * There are three different types of Iris flowers
     * that this dataset classifies.
     *
     * 1. Iris Setosa 
     * 2. Iris Versicolor 
     * 3. Iris Virginica 
     *
     * We are going to change these classes from Strings to numbers.
     * Such that, a value of type equal to
     * 0 would mean setosa,
     * 1 would mean versicolor, and
     * 3 would mean virginica
     */

    let types = new Set(); //To gather Unique classes

    data.forEach((row) => {
        types.add(row.type);
    });

    typesArray = [...types]; // To save the different types of classes

    data.forEach((row) => {
        let rowArray, typeNumber;

        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);
        typeNumber = typesArray.indexOf(row.type); //convert type(string) to type(number)

        X.push(rowArray);
        y.push(typeNumber);
    });

    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize);
    testSetY = y.slice(seperationSize);

    train();
}

function train() {
    knn.train(trainingSetX, trainingSetY, { k: 7 });
    test();
}

function test() {
    const result = knn.predict(testSetX);
    const testSetLength = testSetX.length;
    const predictionError = error(result, testSetY);
    console.log(`Test Set Size = ${testSetLength} and number of Misclass = ${predictionError}`);
    predict();
}

function error(predicted, expected) {
    let misclassifications = 0;
    for (var index = 0; index < predicted.length; index++) {
        if (predicted[index] !== expected[index]) {
            misclassifications++;
        }
    }
    return misclassifications;
}