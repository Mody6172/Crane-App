window.$ = window.jQuery = require("jquery");
require("popper.js");
require("bootstrap");
const { dialog } = require("electron").remote;

craneFilter = require("./cranesFilter").craneFilter;
cranesCardsCreator = require("./cranesCardsCreator").cranesCardsCreator;

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;
var filteredCranes = null;
var toCompareCranes = null;
/*tool tip configuration */
$('[data-toggle="tooltip"]').tooltip();

/*
this is total height calculation.
 */

$(
  "#load-height, #building-height, #obs-height, #safety-height, #rad-work, #edge-dist"
).change(() => {
  // get values
  radWork = parseFloat($("#rad-work").val());
  distEdge = parseFloat($("#edge-dist").val());
  loadH = parseFloat($("#load-height").val());
  raisingH = parseFloat($("#building-height").val());
  loadW = parseFloat($("#obs-height").val());
  safetyFactor = parseFloat($("#safety-height").val()) * 0.01;

  // calculate initial top height
  initialTotalHeight = loadH + raisingH;
  initialMaxBoomAngle = Math.atan(initialTotalHeight / distEdge);
  initialTopHeightLoad = radWork * Math.tan(initialMaxBoomAngle);

  // calculate sling height
  slingHeight =
    (initialTopHeightLoad / (radWork / (0.5 * loadW) - 1)) * (1 + safetyFactor);

  totalHeight = initialTopHeightLoad + slingHeight;

  totalHeight = parseFloat(totalHeight.toFixed(3));
  slingHeight = parseFloat(slingHeight.toFixed(3));

  if (isNaN(totalHeight)) {
    totalHeight = "";
  }
  if (isNaN(slingHeight)) {
    slingHeight = "";
  }
  $("#total-height")
    .val(totalHeight)
    .change();
  $("#sling-height")
    .val(slingHeight)
    .change();
});

/*
this is total weight calculation.
 */

$("#obj-weight, #add-weight, #safety-weight").change(() => {
  objW = parseFloat($("#obj-weight").val());
  // hookW = parseFloat($("#hook-weight").val());
  safetyVal = parseInt($("#safety-weight").val()) * 0.01;
  addW = parseFloat($("#add-weight").val());
  totalW = objW + addW;
  if (isNaN(totalW)) {
    totalW = "";
  } else {
    safetyW = parseFloat($("#safety-weight").val()) * 0.01;
    totalW = totalW * (1 + safetyW);
    totalW = parseFloat(totalW.toFixed(3));
  }
  $("#total-weight").val(totalW);
});

/*
this is boom angle calculation.
 */

$("#sling-height, #obs-height").change(() => {
  loadW = parseFloat($("#obs-height").val());
  slingHeight = parseFloat($("#sling-height").val());

  if (isNaN(loadW) || isNaN(slingHeight)) {
    boomAngle = "";
  } else {
    boomAngle = Math.atan(slingHeight / (loadW * 0.5)) * rad2deg; // atan is in rad
    boomAngle = parseFloat(boomAngle.toFixed(3));
  }
  $("#boom-angle")
    .val(boomAngle)
    .change();
});

/*
this is boom length calculation.
 */

$("#rad-work, #boom-angle").change(() => {
  radWork = parseFloat($("#rad-work").val());
  boomAngle = parseFloat($("#boom-angle").val());
  if (!isNaN(radWork) && !isNaN(boomAngle)) {
    boomAngleRad = boomAngle * deg2rad;
    boomLength = radWork / Math.cos(boomAngleRad);
    boomLength = parseFloat(boomLength.toFixed(3));
  } else {
    boomLength = "";
  }
  $("#boom-length").val(boomLength);
});

$("#next-button").on("click", () => {
  if ($(".first-screen").is(":visible")) {
    // set button text to 'Next'
    $("#next-button").text("Next");
    // get the values
    totalW = parseFloat($("#total-weight").val());
    totalH = parseFloat($("#total-height").val());
    radWork = parseFloat($("#rad-work").val());
    boomL = parseFloat($("#boom-length").val());
    // if values are not available, return
    if (!totalW || !totalH || !radWork || !boomL) {
      dialogOptions = {
        type: "info",
        buttons: ["OK", "Cancel"],
        message: "Values are not filled properly. Please try again."
      };
      dialog.showMessageBox(dialogOptions, i => console.log(i));
      return;
    }
    // toggle unneeded screens visibility
    // filter using the funtion
    filteredCranes = craneFilter(totalW, totalH, radWork, boomL);
    if (filteredCranes.length == 0) {
      dialogOptions = {
        type: "info",
        buttons: ["OK", "Cancel"],
        message: "We found no cranes according to your input. Please try again."
      };
      dialog.showMessageBox(dialogOptions, i => console.log(i));
      return;
    }
    $(".first-screen").hide();
    $(".third-screen").hide();
    // create cranes cards
    cranesCards = cranesCardsCreator(filteredCranes);
    // emptify the html of card group html
    $(".card-group").html("");
    // fill the html of card group
    cranesCards.forEach((card, index) => {
      $(".card-group").append(card);
    });
    // move to the next screen
    $(".second-screen").show();
    // enable back button
    $("#back-button").prop("disabled", false);
  } else if ($(".second-screen").is(":visible")) {
    // change next button to compare button
    $("#next-button").text("Show the Best Crane!");
    // hide unneeded screen
    $(".second-screen").hide();
    $(".first-screen").hide();
    // select the top four cranes to compare, for the time being, we will select the first four.
    toCompareCranes = filteredCranes.slice(0, 4);
    // fill in the comparison table
    $.each($(".table"), (_, table) => {
      $(table)
        .find("tbody")
        .html("");
      toCompareCranes.forEach((c, index) => {
        craneRow = `
        <tr>
        <th scope="row" class="crane-name">${c.Liebherr}</th>
        `;
        for (i = 0; i < $(table).find(".table-headers").length - 1; i++) {
          craneRow += `
          <td>
              <div class="range-div">
                  <input type="range" min="1" max="10" value=1 />
                  <span class="range-output">1</span>
                  </div>
                  </td>
                  `;
        }
        craneRow += `
                </tr>
                `;
        $(table)
          .find("tbody")
          .append(craneRow);
      });
    });

    // make range values interactive
    // set the span on range inputs to the value of the input
    $('input[type="range"]').on("input", function() {
      $(this)
        .next()
        .html($(this).val());
    });

    // show the third screen
    $(".third-screen").show();
  } else if ($(".third-screen").is(":visible")) {
    bestCrane = compareCranesFromTables();
    $("#best-crane-modal")
      .find(".modal-body")
      .text(`${bestCrane.Liebherr}`);
    $("#best-crane-modal").modal("show");
  }
});

// make range values interactive
// set the span on range inputs to the value of the input
$('input[type="range"]').on("input", function() {
  $(this)
    .next()
    .html($(this).val());
});

function compareCranesFromTables() {
  rentalTable = $(".rental");
  rentalOutputs = rentalTable.find(".range-output");
  managerialTable = $(".managerial");
  managerialOutputs = managerialTable.find(".range-output");
  siteConditionTable = $(".site-condition");
  siteConditionOutputs = siteConditionTable.find(".range-output");
  environmentalTable = $(".environmental");
  environmentalOutputs = environmentalTable.find(".range-output");
  // fill crane values from the comparision table
  toCompareCranes.forEach((c, index) => {
    c.dailyRentalCost = parseInt($(rentalOutputs[3 * index + 0]).text());
    c.CranesSizeNumber = parseInt($(rentalOutputs[3 * index + 1]).text());
    c.marketAvailability = parseInt($(rentalOutputs[3 * index + 2]).text());
    c.initialPlanning = parseInt($(managerialOutputs[4 * index + 0]).text());
    c.productivity = parseInt($(managerialOutputs[4 * index + 1]).text());
    c.safety = parseInt($(managerialOutputs[4 * index + 2]).text());
    c.supportAvailability = parseInt(
      $(managerialOutputs[4 * index + 3]).text()
    );
    c.siteAccessibility = parseInt(
      $(siteConditionOutputs[4 * index + 0]).text()
    );
    c.sitePreparation = parseInt($(siteConditionOutputs[4 * index + 1]).text());
    c.weatherCondition = parseInt(
      $(siteConditionOutputs[4 * index + 2]).text()
    );
    c.workingSpace = parseInt($(siteConditionOutputs[4 * index + 3]).text());
    c.energyComsumption = parseInt(
      $(environmentalOutputs[4 * index + 0]).text()
    );
    c.healthIssues = parseInt($(environmentalOutputs[4 * index + 1]).text());
    c.carbonEmmission = parseInt($(environmentalOutputs[4 * index + 2]).text());
    c.neighborImpact = parseInt($(environmentalOutputs[4 * index + 3]).text());
  });
  // get cranes values based on the equation
  toCompareCranes.forEach(c => {
    value =
      c.dailyRentalCost * 0.162651179178 +
      c.CranesSizeNumber * 0.06721633591 +
      c.marketAvailability * 0.11224581348 +
      c.initialPlanning * 0.06539632205 +
      c.productivity * 0.08964710104 +
      c.safety * 0.09947579249 +
      c.supportAvailability * 0.02576759706 +
      c.siteAccessibility * 0.0443854725 +
      c.sitePreparation * 0.10373716429 +
      c.weatherCondition * 0.0335374519 +
      c.workingSpace * 0.07672775869 +
      c.energyComsumption * 0.0306727019 +
      c.healthIssues * 0.0346922114 +
      c.carbonEmmission * 0.03358573742 +
      c.neighborImpact * 0.02026139196;
    c.finalCompareValue = value;
  });
  // get best crane
  bestCrane = toCompareCranes.reduce((prev, current) => {
    return prev.finalCompareValue > current.finalCompareValue ? prev : current;
  });
  return bestCrane;
}

$("#back-button").on("click", () => {
  if ($(".second-screen").is(":visible")) {
    // set button text to 'Next'
    $("#next-button").text("Next");
    // toggle unneeded screens visibility
    $(".third-screen").hide();
    $(".second-screen").hide();
    $(".first-screen").show();
    // disable back button
    $("#back-button").prop("disabled", true);
  } else if ($(".third-screen").is(":visible")) {
    // set button text to 'Next'
    $("#next-button").text("Next");
    // toggle screens visibility
    $(".third-screen").hide();
    $(".first-screen").hide();
    $(".second-screen").show();
  }
});

$("#clear-inputs").on("click", () => {
  $(":input").val("");
});

$(".comparision-flag").change(() => {
  $(".comparision-flag:not(:checked)").each((index, element) => {
    table = $(element.closest("table"));
    table
      .find("tr td")
      .filter(
        `:nth-child(${$(element)
          .parent()
          .index() + 1})`
      )
      .each((index, element) => {
        element = $(element);
        element.find("input").val("0");
        element.find(".range-output").text("0");
        element.find("input").prop("disabled", true);
        element.addClass("deactivated");
      });
  });
  $(".comparision-flag:checked").each((index, element) => {
    table = $(element.closest("table"));
    table
      .find("tr td")
      .filter(
        `:nth-child(${$(element)
          .parent()
          .index() + 1})`
      )
      .each((index, element) => {
        element = $(element);
        element.find("input").val("1");
        element.find(".range-output").text("1");
        element.removeClass("deactivated");
        element.find("input").prop("disabled", false);
      });
  });
});

// help logic
$("#more-info").click(() => {
  // $("#more-information-modal").modal("show");
  window.open(
    "info.html",
    "_blank",
    "minWidth=900",
    "maxHeight=680",
    "minHeight=680",
    "center=true"
  );
});
