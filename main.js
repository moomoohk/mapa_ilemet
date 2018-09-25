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

class Zoom {
    constructor() {
        this.factor = 1.00;
        this.min = 0.33;
        this.max = 9.00;
        this.sensitivity = 0.005;

        this.anchor = createVector(0, 0);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let zoomSettings;

let mapImage;
let mapImageOffset;
let clickOffset;  // Offset relative to mapImageOffset

function getPositionOnScreen(longitude, latitude){
    // use offsets
    longitude -= MapBounds.W;
    // do inverse because the latitude increases as we go up but the y decreases as we go up.
    // if we didn't do the inverse then all the y values would be negative.
    latitude = MapBounds.N - latitude;

    // set x & y using conversion
    let x = int(mapImage.width * (longitude / MapBounds.mapWidth));
    let y = int(mapImage.height * (latitude / MapBounds.mapHeight));

    return new Point(mapImageOffset.x + x, mapImageOffset.y + y);
    // return new Point((mapImageOffset.x + x / mapScale * zoom), (mapImageOffset.y + y / mapScale * zoom));
}

function preload() {
    mapImage = loadImage("map.png");
    loadXMLFromFile();
    // loadXMLFromURL();
}

function setup() {
    let canvas = createCanvas(windowWidth - 300, windowHeight);
    canvas.parent("map_image");

    constructObjects();

    document.querySelector("#app").style.display = "block";

    mapImageOffset = createVector(0, 0);
    zoomSettings = new Zoom();
}

function windowResized() {
    resizeCanvas(windowWidth - 300, windowHeight);
}

function draw() {
    background("white");

    // translate(zoomSettings.anchor.x, zoomSettings.anchor.y);
    // scale(zoomSettings.factor);
    // translate(-zoomSettings.anchor.x, -zoomSettings.anchor.y);


    imageMode(CENTER);
    image(
        mapImage,
        0,
        0,
        mapImage.width / 2,
        mapImage.height / 2,
        0, 0);

    // image(
    //     mapImage,
    //     mapImageOffset.x /*- (mapImage.width / 2)*/,
    //     mapImageOffset.y /*- (mapImage.height / 2)*/,
    //     (mapImage.width / mapScale) * zoom,
    //     (mapImage.height / mapScale) * zoom,
    //     0, 0);

    // Jerusalem
    // let screenPos = drawCity(895);

    for (let cityIndex in cities) {
        drawCity(cityIndex);
    }

    for (let cityIndex in cities) {
        let city = cities[cityIndex];
        let screenPos = getPositionOnScreen(city.wgs84.x, city.wgs84.y);

        if (Math.hypot(mouseX - screenPos.x, mouseY - screenPos.y) <= 10) {
            drawLabel(cityIndex, screenPos);
            break;
        }
    }

    // line(mouseX, mouseY, p.x, p.y);
}

function drawCity(cityIndex) {
    let city = cities[cityIndex];

    let screenPos = getPositionOnScreen(city.wgs84.x, city.wgs84.y);

    fill("red");
    noStroke();
    ellipse(screenPos.x, screenPos.y, 10);
}

function drawLabel(cityIndex, screenPos) {
    let city = cities[cityIndex];

    fill("red");
    strokeWeight(2);
    stroke("black");
    ellipse(screenPos.x, screenPos.y, 15);

    textSize(30);

    const padding = 5;
    const xOffset = 15;
    const textHeight = textAscent() + textDescent();

    fill("white");
    rect(
        screenPos.x + xOffset,
        screenPos.y - (textAscent() / 2) - padding,
        textWidth(city.englishName) + padding * 2,
        textHeight + padding,
        10
    );

    noStroke();
    fill("black");
    text(city.englishName, screenPos.x + xOffset + padding, screenPos.y + (textAscent() / 2));
}

function mousePressed(event) {
    clickOffset = createVector(mapImageOffset.x - mouseX, mapImageOffset.y - mouseY);
}

function mouseDragged() {
    if (mouseX > 0) {
        let m = createVector(mouseX, mouseY);
        // mapImageOffset.set(m).add(clickOffset);
        translate(m.add(clickOffset));
    }
}

function mouseWheel() {
    if (mouseX > 0) {
        zoomSettings.anchor = createVector(mouseX, mouseY);
        zoomSettings.factor += zoomSettings.sensitivity * -event.delta;
        zoomSettings.factor = constrain(zoomSettings.factor, zoomSettings.min, zoomSettings.max);

        return false;
    }
}