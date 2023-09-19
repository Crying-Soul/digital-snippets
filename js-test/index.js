
const cors = require('cors');
const DL = require('./lib');

const DigitalLib = new DL();

const express = require("express");

port = 3000;
app = express();
app.use(cors());
app.set('json spaces', 2);

app.get("/", (req, res) => {
    res.status(200).json(DigitalLib.getJsonFromExcelFirst('./file.xlsm'))
});
app.get("/raw", (req, res) => {
    res.status(200).json(DigitalLib.getJsonFromExcelFirst('./file.xlsm', {}))
});
app.get("/table", (req, res) => {
    res.status(200).send(DigitalLib.getTableFromExcelFirst('./file.xlsm', {}))
});
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
})
