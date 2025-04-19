const startNouns = ["Musiker", "Gast", "Mitglieder", "Kaffee", "Bibel", "Worship", "Glaubens"];
const endNouns = ["abend", "party", "treffen", "versammlung", "kurs", "planung"];

const locations = ["Mittelstraße 12A, 70180 Stuttgart", "Stückle", "Liebenzell", "Marienplatz"]

const randomElement = (arr) => {
    return arr[Math.min(arr.length - 1, Math.round(Math.random() * arr.length))];
};

const createTitle = () => {
    return `${randomElement(startNouns)}${randomElement(endNouns)}`
};

const createEvent = (date) => {
    return {
        titleFormatted: createTitle(),
        detailUrl: "https://domsapp.communiapp.de/page/detail/tab/event-346120",
        dateTime: date.toISOString(),
        locationFormatted: randomElement(locations),
    }
};

export const generateEvents = (args) => {
    const {count, startDate, minutesBetween} = {...args};
    let result = [];
    for (let i = 1; i <= count; i++) {
        result.push(createEvent(new Date(+startDate + i * minutesBetween * 60 * 1000)));
    }
    return result;
};