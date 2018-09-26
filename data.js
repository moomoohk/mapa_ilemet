const xmlDataURL = "http://www.mapi.gov.il/ProfessionalInfo/Documents/dataGov/CITY.xml";
// https://data.gov.il/dataset/828

let xmlData;
let cities = [];


function loadXMLFromURL() {
    function loadSuccess(ret) {
        console.log("Loaded XML");
    }

    function loadError(e) {
        select("#star").style("animation-play-state", "paused");

        createP("Error loading data!").style("background-color", "red");
        createDiv(e).style("background-color", "red");
    }

    xmlData = loadXML("https://cors-anywhere.herokuapp.com/" + xmlDataURL, loadSuccess, loadError);
}

function loadXMLFromFile() {
    xmlData = loadXML("cities.xml");
}

function constructObjects() {
    if (cities.length !== 0) {
        return;
    }

    let records =
        xmlData.getChild("WorkspaceData").getChild("DatasetData").getChild("Data").getChild("Records").getChildren();
    console.log("Loaded", records.length, "records");

    for (let i in records) {
        let record = records[i];

        let values = record.getChild("Values");

        if (values.getChild(8).content.trim().length === 0) {
            continue;
        }

        let x = values.getChild(1).getChild("X").content;
        let y = values.getChild(1).getChild("Y").content;
        let hebrewName = values.getChild(4).content;
        let type = values.getChild(7).content;
        let englishName = values.getChild(8).content;
        let population = values.getChild(5).content;
        cities.push(new City(englishName, hebrewName, x, y, type, population));
    }
}