class State {
    constructor() {
        this.cityIndex = null;
        this.city = null;
        this.reveal = null;
        this.mark = null;
        this.distance = null;
        this.roundStartTime = Date.now();
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
        this.roundStartTime = Date.now();
        select("#result_container").style("display", "none");

        this.generateCity();
    }

    guess(mouseCoords) {
        this.reveal = mouseCoords;

        let screenPos = getPositionOnScreen(cities[state.cityIndex].wgs84.x, cities[state.cityIndex].wgs84.y);
        this.distance = dist(state.reveal.x, state.reveal.y, screenPos.x, screenPos.y);

        select("#result_container").style("display", "block");
        select("#distance").html(nfc(this.distance / distanceScale, 1) + "ק“מ");

        State._setResultMessage(this.distance / distanceScale);

        // const roundTime =  moment(this.roundStartTime).fromNow(true);

        State._setRoundTime(this.roundStartTime);
    }

    static _setResultMessage(distance) {
        const messages = {
            0: ["מדהים!", "קלעת בול!", "מטורף!", "ממש מלך הארץ"],
            5: ["קרוב", "כמעט", "באיזור", "בשכונה"],
            50: [" לא קרוב", "אולי פעם הבאה", "אפילו לא באיזור חיוג", "לא בכיוון..."]
        };

        let message = "";

        for (const key in messages) {
            if (distance > key) {
                message = messages[key][Math.floor(Math.random() * messages[key].length)];
            } else {
                break;
            }
        }

        select("#message").html(message);
    }

    static _setRoundTime(roundTime) {
        const now = Date.now();

        const seconds = dateFns.differenceInSeconds(now, roundTime) % 60;
        const minutes = dateFns.differenceInMinutes(now, roundTime) % 60;
        const hours = dateFns.differenceInHours(now, roundTime) % 24;
        const days = dateFns.differenceInDays(now, roundTime);

        let output = "לקח לך ";

        if (days > 0) {
            if (days === 1) {
                output += "יום אחד ";
            } else if (days === 2) {
                output += "יומיים ";
            } else {
                output += days + " ימים ";
            }
        }

        if (hours > 0) {
            if (hours === 1) {
                output += "שעה אחת ";
            } else if (hours === 2) {
                output += "שעתיים ";
            } else {
                output += hours + " שעות ";
            }
        }

        if (minutes > 0) {
            if (minutes === 1) {
                output += "דקה אחת ";
            } else {
                output += minutes + " דקות ";
            }
        }

        if (seconds === 1) {
            output += "שנייה אחת";
        } else {
            output += seconds + " שניות";
        }

        select("#time").html(output);
    }
}