defaultImgPath = "img.png";

function cardsGenerator(cranes) {
  cranesHtmls = [];
  for (i = 0; i < cranes.length; i++) {
    crane = cranes[i];
    craneHtml = `
        <div class="card">
                    <img class="card-img-top"
                        src="${crane.imgURL}"
                        alt="Crane Image not found ${crane.imgURL}">
                    <div class="card-body">
                        <h5 class="card-title">${crane.Liebherr}</h5>
                        <hr class="h-divider" />
                        <div class="card-text">
                            <div class="row">
                                <div class="col col-sm info-col">
                                    Type: <small class="text-muted">${crane.type}</small>
                                </div>
                                <div class="col col-sm info-col">
                                    Rental Cost per Hour: <small class="text-muted">${crane.cost}$</small>
                                </div>
                            </div>
                            <hr class="h-divider" />
                            <div class="row">
                                <div class="col col-sm info-col">
                                    Length: <small class="text-muted">${crane.totalLength}</small>
                                </div>
                                <div class="col col-sm info-col">
                                    Width: <small class="text-muted">${crane.totalWidth}</small>
                                </div>
                            </div>
                            <hr class="h-divider" />
                            <div class="row">
                                <div class="col col-sm info-col">
                                    Max Radius: <small class="text-muted">${crane.maxRad}</small>
                                </div>
                                <div class="col col-sm info-col">
                                    Min Radius: <small class="text-muted">${crane.minRad}</small>
                                </div>
                            </div>
                            <hr class="h-divider" />
                            <div class="row">
                                <div class="col col-sm info-col">
                                    Boom Length From: <small class="text-muted">${crane.boomLengthFrom}</small>
                                </div>
                                <div class="col col-sm info-col">
                                    Boom Length To: <small class="text-muted">${crane.boomLengthTo}</small>
                                </div>
                            </div>
                            <hr class="h-divider" />
                            <div class="row">
                                <div class="col col-sm info-col">
                                    Max Hoist Height: <small class="text-muted">${crane.maxHoistHeight}</small>
                                </div>
                                <div class="col col-sm info-col">
                                    Max Load: <small class="text-muted">${crane.maxLoad}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    cranesHtmls.push(craneHtml);
  }
  return cranesHtmls;
}

module.exports.cranesCardsCreator = cardsGenerator;
