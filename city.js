// ITM WTK
proj4.defs("ITM", "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs ");

class City {
    /**
     *
     * @param englishName
     * @param hebrewName
     * @param x Longitude
     * @param y Latitude
     * @param type
     */
    constructor(englishName, hebrewName, x, y, type) {
        this.englishName = englishName;
        this.hebrewName = hebrewName;

        this.wgs84 = proj4(
            "ITM",
            "WGS84",
            {"x": x, "y": y});

        this.type = type;
    }

    toString() {
        return "<City " + this.englishName + " - " + this.x + ", " + this.y + ">";
    }
}