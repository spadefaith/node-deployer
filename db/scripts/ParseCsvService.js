const fs = require("fs");
const csv = require("fast-csv");

module.exports = function ParseCsvService(path) {
  if (!fs.existsSync(path)) {
    return [];
  }

  return new Promise(function (resolve, reject) {
    let data = [];
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        reject(error);
      })
      .on("data", (row) => data.push(row))
      .on("end", () => {
        resolve(data);
      });
  });
};
