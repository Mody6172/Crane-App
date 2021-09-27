const fs = require("fs");
const { promisify } = require("util");

var cranes = [];

function getGeneralAttributes() {
  var content = fs.readFileSync(
    __dirname + "\\cranes_general_attributes.csv",
    "utf-8"
  );
  lines = content.split("\n");
  for (i = 0; i < lines.length; i++) {
    row = lines[i].split(",");
    id = row[0];
    if (isNaN(parseInt(id))) {
      continue;
    }
    liebherr = row[1];
    type = row[2];
    totalLength = row[3];
    totalWidth = row[4];
    maxLoad = row[5];
    minRad = row[6];
    maxRad = row[7];
    boomLengthFrom = row[8];
    boomLengthTo = row[9];
    maxHoistHieght = row[10];
    cost = row[11];
    crane = {
      id: parseFloat(id),
      Liebherr: liebherr,
      type: type,
      totalLength: parseFloat(totalLength),
      totalWidth: parseFloat(totalWidth),
      maxLoad: parseFloat(maxLoad),
      minRad: parseFloat(minRad),
      maxRad: parseFloat(maxRad),
      boomLengthFrom: parseFloat(boomLengthFrom),
      boomLengthTo: parseFloat(boomLengthTo),
      maxHoistHeight: parseFloat(maxHoistHieght),
      cost: parseFloat(cost)
    };
    cranes.push(crane);
  }
}

function assignSpecificAttributes(folderPath, craneId) {
  content = fs.readFileSync(folderPath + `${craneId}.csv`, "utf-8");
  crane = cranes.find(c => {
    return c.id == craneId;
  });
  tuples = [];
  lengths = [];
  content.split("\n").forEach((line, index) => {
    // the first line is the lengths line
    if (index == 0) {
      line.split(",").forEach(length => {
        length = length.split(" ")[1];
        lengths.push(length);
      });
    }
    // for the other lines:
    else {
      radious = "";
      line.split(",").forEach((elem, i) => {
        // the first column contains the radious
        if (i == 0) {
          radious = elem;
        }
        // rest of the columns are the weights
        else {
          // if there is a value for elem
          if (elem && elem !== "" && elem != "\r") {
            elem = elem.trim();
            tuples.push([
              parseFloat(radious),
              parseFloat(lengths[i]),
              parseFloat(elem)
            ]);
          }
        }
      });
    }
  });
  // add tuples to the crane
  crane.lengthWeightPerRadious = tuples;
  // add images to the crane
  crane.imgURL = folderPath + "img.jpg";
}

function getSpecificAttributes() {
  parentFolder = __dirname + "\\cranes_specific_attributes/";
  innerFolders = fs.readdirSync(parentFolder);
  innerFolders.forEach(folder => {
    assignSpecificAttributes(`${parentFolder}${folder}/`, folder);
  });
}

getGeneralAttributes();
getSpecificAttributes();

module.exports.cranes = cranes;
