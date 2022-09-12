const fs = require("fs");
const path = require("path");

// function to write to file
function writeToFile(filepath, content) {
  fs.writeFile(filepath, JSON.stringify(content), (err) => {});
}

function fillter(arr, obj) {
  return new Promise((resolve, reject) => {
    resolve(arr.filter((arrObj) => arrObj.id != obj));
  });
}

module.exports = [writeToFile, fillter];
