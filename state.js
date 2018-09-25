class State {
    constructor() {
        this.cityIndex = null;
        this.city = null;
        this.reveal = null;
        this.mark = null;
        this.distance = null;
    }

    generateCity() {
        this.cityIndex = Math.floor(Math.random() * cities.length);
        this.city = cities[this.cityIndex];
        select("#city_name").html(this.city.hebrewName);
    }

    reset() {
        this.reveal = null;
        this.mark = null;
        this.distance = null;
        select("#result").style("display", "none");

        this.generateCity();
    }

    guess(mouseCoords) {
        this.reveal = mouseCoords;

        let screenPos = getPositionOnScreen(cities[state.cityIndex].wgs84.x, cities[state.cityIndex].wgs84.y);
        this.distance = dist(state.reveal.x, state.reveal.y, screenPos.x, screenPos.y);

        select("#result").style("display", "block");
        select("#distance").html(nfc(this.distance / distanceScale, 1) + "ק“מ");
    }
}