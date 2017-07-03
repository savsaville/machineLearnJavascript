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