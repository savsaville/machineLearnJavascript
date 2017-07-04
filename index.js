const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');
const knn = new KNN();

const csvFilePath = 'heartDiseaseData.csv'; //Data 
const names = ['Age',
    'Sex',
    'Chest Pain',
    'Blood Pressure',
    'Cholestral Level',
    'Blood Sugar Level',
    'Rest ECG results',
    'Maximum Heart Rate',
    'Exercise Angina Achieved?',
    'Old Peak',
    'Slope of Exercise',
    'Blood Vessels Colored',
    'Thalamus condition',
    'Heart Disease Diagnosis'

]; //For header

// Age in years
// Sex - Male = 1, Female = 0
// Chest Pain - 1 = typical angina, 2 = atypical angina, 3 = non-anginal pain, 4 = asymptomatic 
// Blood Pressure (mm/HG)
// Cholestral Level, (mg/dl)
// Fasting Blood Sugar > 120 - True = 1, False = 0
// Rest ECG results - 0 = Normal, 1 = some abnormality, 2 = definite ventricle hypertrophy
// Max Heart Rate achieved
// Exercise Angina Achieved? 1 = Yes, 2 = No
// ST depression induced by exercise relative to rest
// the slope of the peak exercise ST segment - 1 = upslope, 2 = flat, 3 = downslope
// ca: number of major vessels (0-3) colored by flourosopy 
// Thalamus Condition. 3 = normal; 6 = fixed defect; 7 = reversable defect
// Diagnosis of Heart Disease "0" is almost no chance. '1" < 25%, "2" 25-50%, "3" 50-75%, "4" > 75%
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
        seperationSize = 0.7 * data.length;
        data = shuffleArray(data);
        dressData();
    });

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

        rowArray = Object.keys(row).map(key => parseFloat(row[key]));
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

function predict() {
    let temp = [];
    prompt.start();

    prompt.get(['Age',
            'Sex',
            'Chest Pain',
            'Blood Pressure',
            'Cholestral Level',
            'Blood Sugar Level',
            'Rest ECG results',
            'Maximum Heart Rate',
            'Exercise Angina Achieved?',
            'Old Peak',
            'Slope of Exercise',
            'Blood Vessels Colored',
            'Thalamus condition'
        ],
        function(err, result) {
            if (!err) {
                for (var key in result) {
                    temp.push(parseFloat(result[key]));
                }
                console.log(`with those answers, your chance of heart disease on the scale of 0-4 is ${knn.getSinglePrediction(temp)}`)
                console.log("0 equal to less than 1%, 1 equal to less than 25%, 2 is between 25-50%, 3 is between 50-75% and 4 is over 75%");
            }
        });
}

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