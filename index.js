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