const cranes = require("./cranesReader").cranes;
function craneFilter(totalW, totalH, radWork, boomL) {
  console.log(cranes);
  firstFilteredCranes = cranes.filter(c => {
    return (
      c.maxLoad >= totalW &&
      c.maxHoistHeight >= totalH &&
      c.maxRad >= radWork &&
      c.minRad <= radWork &&
      c.boomLengthTo >= boomL &&
      c.boomLengthFrom <= boomL
    );
  });
  secondFilteredCranes = firstFilteredCranes.filter(c => {
    for (i = 0; i < c.lengthWeightPerRadious.length; i++) {
      values = c.lengthWeightPerRadious[i];
      rad = values[0];
      len = values[1];
      if (rad >= radWork && len >= boomL) {
        return totalW <= values[2];
      }
    }
    return false;
  });
  // sort cranes based on maxload
  console.log("first:");
  console.log(firstFilteredCranes);
  console.log("second:");
  console.log(secondFilteredCranes);
  filteredCranes = secondFilteredCranes;
  filteredCranes.sort((a, b) => {
    return a.maxLoad - b.maxLoad;
  });
  // return the first three
  return filteredCranes;
}

module.exports.craneFilter = craneFilter;
