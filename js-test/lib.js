module.exports = class DigitalLib {
  constructor() {
    this.xlsx = require("xlsx");
    this.excel = require("excel4node");
    this.path = require("path");
    this.fs = require("fs");
    this.parseOpts = { header: "A", raw: false };
    this.filesRoutes = [];
  }

  getLetterSlice(c1 = "A", c2 = "Z") {
    const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return a.slice(a.indexOf(c1), a.indexOf(c2) + 1);
  }

  getAllFileRoutes(directory) {
    this.fs.readdirSync(directory).forEach((file) => {
      const absolute = this.path.join(directory, file);
      if (this.fs.statSync(absolute).isDirectory())
        return this.getAllFileRoutes(absolute);
      else return this.filesRoutes.push(absolute);
    });
  }
  getExcelRow(jsonData, row = "A") {
    const excelRow = [];
    jsonData.forEach((el, i) => {
      if (row in el) {
        excelRow.push({ row: i, data: el[row] });
      }
    });
    return excelRow;
  }
  getJsonFromExcelAll(fileRoute, opts = this.parseOpts) {
    let workbook = this.xlsx.read(fileRoute, {
      type: "binary",
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    let sheet_name_list = workbook.SheetNames;
    let json = [];
    sheet_name_list.forEach((sheet_name, index) => {
      json.push({
        name: sheet_name,
        index: index,
        json: this.xlsx.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list[0]],
          opts
        ),
      });
    });
  }
  getJsonFromExcelFirst(fileRoute, opts = this.parseOpts) {
    let workbook = this.xlsx.readFile(fileRoute);
    let sheet_name_list = workbook.SheetNames;
    return this.xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]],
      opts
    );
  }
  getTableFromExcelFirst(fileRoute, opts = this.parseOpts) {
    let workbook = this.xlsx.readFile(fileRoute);
    let sheet_name_list = workbook.SheetNames;
    return this.xlsx.utils.sheet_to_html(
      workbook.Sheets[sheet_name_list[0]],
      opts
    );
  }
  createFile(path, filename, data, encoding = "utf8") {
    try {
      this.fs.writeFileSync(`${path}/${filename}`, data);
      return true;
    } catch (e) {
      console.log("Cannot write file ", e);
      return false;
    }
  }
};
