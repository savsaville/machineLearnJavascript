const ml = require('ml-regression');
const csv = require('csvtojson');
const SLR = ml.SLR; // Simple Linear Regression

const csvFilePath = 'advertising.csv' //data source
let csvData = [], //parsed Data
    X = [], //Input
    y = []; //Output

let regressionModel;

const readline = require('readline'); // For user prompt to allow predictions

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
        csvData.push(jsonObj);
    })
    .on('done', () => {
        dressData(); // To get data points from Json Objects
        performRegression();
    });

function dressData() {
    /**
     * One row of the data object looks like:
     * {
     *   TV: "10",
     *   Radio: "100",
     *   Newspaper: "20",
     *   "Sales": "1000"
     * }
     *
     * So while adding the data points,
     * we need to parse the String value as a Float.
     */

    csvData.forEach((row) => {
        X.push(f(row.TV));
        y.push(f(row.Sales));
    });
}

function f(s) {
    return parseFloat(s);
}

function performRegression() {
    regressionModel = new SLR(X, y); //Train the model on training data
    console.log(regressionModel.toString(3));
    predictOutput();
}

function predictOutput() {
    rl.question('Enter input X for prediction: ', (answer) => {
        console.log(`At X = ${answer}, y = ${regressionModel.predict(parseFloat(answer))}`);
        predictOutput();
    });
}