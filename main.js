/**
 * Created by MeshulamSilk on 16/2/17.
 */

// https://commons.wikimedia.org/wiki/File:Israel_location_map.svg
class MapBounds {
    static get N() {
        return 33.5;
    }

    static get S() {
        return 29.3;
    }

    static get W() {
        return 33.7;
    }
    static get E() {
        return 36.3;
    }

    static get mapHeight() {
        return MapBounds.N - MapBounds.S;
    }

    static get mapWidth() {
        return MapBounds.E - MapBounds.W;
    }
}

let mapImage;

let drawAllCities = false;

let state;

const distanceScale = 8;

function getPositionOnScreen(longitude, latitude){
    // use offsets
    longitude -= MapBounds.W;
    // do inverse because the latitude increases as we go up but the y decreases as we go up.
    // if we didn't do the inverse then all the y values would be negative.
    latitude = MapBounds.N - latitude;

    // set x & y using conversion
    let x = int(mapImage.width * (longitude / MapBounds.mapWidth));
    let y = int(mapImage.height * (latitude / MapBounds.mapHeight));

    return createVector(x, y);
    // return new Point((mapImageOffset.x + x / mapScale * zoom), (mapImageOffset.y + y / mapScale * zoom));
}

function preload() {
    mapImage = loadImage("map.png");

    // loadXMLFromFile();
    loadXMLFromURL();
}

function setup() {
    let canvas = createCanvas(windowWidth - 300, windowHeight);
    canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e));

    canvas.parent("map_image");

    constructObjects();

    select("#app").style("display", "block");

    state = new State();
    state.generateCity();

    select("#next").mouseReleased((_) => state.reset());

    controls.view.zoom = 0.15;
    controls.view.x = canvas.width / 2 - (mapImage.width * controls.view.zoom) / 2;
    controls.view.y = canvas.height / 2 - (mapImage.height * controls.view.zoom) / 2;
}

function windowResized() {
    resizeCanvas(windowWidth - 300, windowHeight);
}

function draw() {
    background("white");

    translate(controls.view.x, controls.view.y);

    scale(controls.view.zoom);

    image(
        mapImage,
        0,
        0,
        mapImage.width,
        mapImage.height,
        0, 0);

    if (drawAllCities) {
        for (let cityIndex in cities) {
            drawCity(cityIndex);
        }

        for (let cityIndex in cities) {
            let city = cities[cityIndex];
            let screenPos = getPositionOnScreen(city.wgs84.x, city.wgs84.y);

            if (Math.hypot(
                    (mouseX - controls.view.x) / controls.view.zoom - screenPos.x,
                    (mouseY - controls.view.y) / controls.view.zoom - screenPos.y
                ) <= 10) {
                drawLabel(cityIndex, screenPos);
                break;
            }
        }
    }

    if (state.reveal) {
        let screenPos = getPositionOnScreen(cities[state.cityIndex].wgs84.x, cities[state.cityIndex].wgs84.y);

        let distance = dist(state.reveal.x, state.reveal.y, screenPos.x, screenPos.y);

        strokeWeight(2);
        stroke("black");
        line(state.reveal.x, state.reveal.y, screenPos.x, screenPos.y);

        drawCity(state.cityIndex);
        if (state.reveal.x < screenPos.x) {
            drawLabel(cities[state.cityIndex].hebrewName, screenPos, "right");
        } else {
            drawLabel(cities[state.cityIndex].hebrewName, screenPos, "left");
        }

        const distanceText = nfc(distance / distanceScale, 1) + "km";

        // Ensure distance label doesn't overlap with city name label
        if (state.distance > 150) {
            push();
            translate((state.reveal.x + screenPos.x) / 2, (state.reveal.y + screenPos.y) / 2);

            // Ensure distance label is always placed on top of distance line
            if (state.reveal.x > screenPos.x) {
                rotate(atan2(state.reveal.y - screenPos.y, state.reveal.x - screenPos.x));
            } else {
                rotate(atan2(screenPos.y - state.reveal.y, screenPos.x - state.reveal.x));
            }

            text(distanceText, 0, -5);
            pop();
        } else {
            const distanceLabelPos = createVector(screenPos.x, screenPos.y + 50);
            if (state.reveal.x < screenPos.x) {
                drawLabel(distanceText, distanceLabelPos, "right", false, false);
            } else {
                drawLabel(distanceText, distanceLabelPos, "left", false, false);
            }
        }
    }

    if (state.mark) {
        let screenPos = getPositionOnScreen(state.mark.x, state.mark.y);

        fill("green");
        strokeWeight(5);
        stroke("green");
        line(state.mark.x - 10, state.mark.y - 10, state.mark.x + 10, state.mark.y + 10);
        line(state.mark.x - 10, state.mark.y + 10, state.mark.x + 10, state.mark.y - 10);
        // ellipse(state.mark.x, state.mark.y, 10);
    }

    // link(970, 882);
    // link(882, 932);
    // link(932, 970);
    //
    // drawCity(970);
    // drawCity(882);
    // drawCity(932);
}

function link(city1, city2) {
    let city1Pos = getPositionOnScreen(cities[city1].wgs84.x, cities[city1].wgs84.y);
    let city2Pos = getPositionOnScreen(cities[city2].wgs84.x, cities[city2].wgs84.y);

    let distance = dist(city1Pos.x, city1Pos.y, city2Pos.x, city2Pos.y);

    strokeWeight(2);
    stroke("black");
    line(city1Pos.x, city1Pos.y, city2Pos.x, city2Pos.y);

    push();
    translate((city1Pos.x + city2Pos.x) / 2, (city1Pos.y + city2Pos.y) / 2);
    rotate(atan2(city2Pos.y - city1Pos.y, city2Pos.x - city1Pos.x));
    text(nfc(distance, 1), 0, -5);
    pop();
}

function drawCity(cityIndex) {
    let city = cities[cityIndex];

    let screenPos = getPositionOnScreen(city.wgs84.x, city.wgs84.y);

    fill("red");
    noStroke();
    ellipse(screenPos.x, screenPos.y, 10);
}

function drawLabel(labelText, screenPos, side, withPoint, background) {
    side = side || "right";

    if (withPoint === undefined) {
        withPoint = true;
    }
    if (background === undefined) {
        background = true;
    }

    if (withPoint) {
        fill("red");
        ellipse(screenPos.x, screenPos.y, 15);
    }

    strokeWeight(2);
    stroke("black");
    textSize(30);

    const padding = 5;
    const xOffset = 15;
    const textHeight = textAscent() + textDescent();

    if (background) {
        fill("white");
        if (side === "right") {
            rect(
                screenPos.x + xOffset,
                screenPos.y - (textAscent() / 2) - padding,
                textWidth(labelText) + padding * 2,
                textHeight + padding,
                10
            );
        }
        if (side === "left") {
            rect(
                screenPos.x - xOffset - padding * 2 - textWidth(labelText),
                screenPos.y - (textAscent() / 2) - padding,
                textWidth(labelText) + padding * 2,
                textHeight + padding,
                10
            );
        }
    }

    noStroke();
    fill("black");

    if (side === "right") {
        text(labelText, screenPos.x + xOffset + padding, screenPos.y + (textAscent() / 2));
    }
    if (side === "left") {
        text(labelText, screenPos.x - xOffset - padding - textWidth(labelText), screenPos.y + (textAscent() / 2));
    }
}

function mousePressed(event) {
    if (event.target !== select("canvas").elt) {
        return;
    }

    Controls.move(controls).mousePressed(event);

    const mouseCoords = createVector(
        (mouseX - controls.view.x) / controls.view.zoom,
        (mouseY - controls.view.y) / controls.view.zoom
    );

    if (state.mark) {
        if (dist(state.mark.x, state.mark.y, mouseCoords.x, mouseCoords.y) < 10) {
            state.guess(mouseCoords);
            return;
        }
    }

    if (!state.reveal) {
        state.mark = mouseCoords;
    }
}

function mouseDragged(event) {
    if (event.target === select("canvas").elt) {
        Controls.move(controls).mouseDragged(event);
    }
}

function mouseReleased() {
    if (event.target === select("canvas").elt) {
        Controls.move(controls).mouseReleased();
    }
}

function mouseWheel() {
    // if (mouseX > 0) {
    //     zoomSettings.anchor = createVector(mouseX, mouseY);
    //     zoomSettings.factor += zoomSettings.sensitivity * -event.delta;
    //     zoomSettings.factor = constrain(zoomSettings.factor, zoomSettings.min, zoomSettings.max);
    //
    //     return false;
    // }
}