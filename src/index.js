let eventsPerMonth = []
let titlePerMonth = []
let selectedMonth = ""
let lastMonth

const dayStrings = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
const monthStrings = ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"]

const route = "/events";
const testRoute = "/sampleEvents";
const fallbackRenderRoute = "https://lgvstuttgart-kalender.onrender.com/events"
const prodRoute = "https://lgvstuttgart-calendar.azurewebsites.net/api/communiEvents"

const domParser = new DOMParser();
const now = new Date();

// current -> 1
// previous -> 0
const getMonth = (date) => {
    if (date.getFullYear() === now.getFullYear() && date.getMonth() == now.getMonth()) return 1;
    if (+date < +now) return 0;
    const y = date.getFullYear() - now.getFullYear();
    return  1 + date.getMonth() - now.getMonth() + y * 12;
}

const populateMonths = (events) => {
    lastMonth = getMonth(new Date(events[events.length - 1].dateTime));
    for (let m = 0; m <= lastMonth; m++) {
        eventsPerMonth[m] = [];
        titlePerMonth[m] = `${monthStrings[(now.getMonth() + m - 1) % 12]} ${now.getFullYear() + Math.round((m - 1) / 12)}`;
    }
    for (let e of events) {
        const m = getMonth(new Date(e.dateTime));
        eventsPerMonth[m] = eventsPerMonth[m] || [];
        eventsPerMonth[m].push(e);
    }
}

const loadEvents = async () => {
    const response = await fetch(prodRoute, {
        method: 'get'
    });
    // we're assuming they are chronologically sorted
    let events = await response.json();
    let allEvents = [...mixInSundays(events)];
    populateMonths(allEvents);
}

function* mixInSundays(events) {
    let last = events[0];
    yield last;
    let i = 1;
    while (i < events.length) {
        const e = events[i];
        const nextSunday = findNextSunday(new Date(last.dateTime));

        const startDate = new Date(e.dateTime);
        if (startDate.getDay() !== 0) {
            if (startDate.getTime() < nextSunday.getTime()) {
                yield e;
                last = e;
                i++;
            }
            else {
                const sundayEvent = createSundayEvent(nextSunday);
                yield sundayEvent;
                last = sundayEvent;
            }
        }
        else {
            // handle scheduled Sunday event
            const endDate = new Date(e.endDateTime);
            const sundayEndTime = nextSunday.getTime() + 1000 * 60 * 60;

            const intersects = endDate.getTime() > nextSunday.getTime() && startDate.getTime() < sundayEndTime;
            if (last == nextSunday || endDate.getTime() <= nextSunday.getTime() || intersects) {
                yield e;
                last = e;
                i++;
            }
            else {
                const sundayEvent = createSundayEvent(nextSunday);
                yield sundayEvent;
                last = sundayEvent;
            }
        }
    }
}

const findNextSunday = (date) => {
    const nextSunday = new Date(date);
    nextSunday.setDate(date.getDate() + (7 - date.getDay()));
    nextSunday.setHours(10);
    nextSunday.setMinutes(30);
    return nextSunday;
};

const createSundayEvent = (date) => {
    const end = new Date(date);
    end.setHours(11);
    end.setMinutes(30);
    return {
        dateTime: date,
        endDateTime: end,
        titleFormatted: "Gottesdienst",
        locationFormatted: "Mittelstraße 12A",
        detailUrl: "https://liebenzeller-gemeinde-stuttgart.de/Gottesdienst",
    };
}

const renderCalendar = () => {
    const title = document.getElementById('title');
    title.innerText = titlePerMonth[selectedMonth];

    const table = document.getElementById('calendar');
    table.innerHTML = "";

    eventsPerMonth[selectedMonth].forEach(event => {
        renderEvent(event).forEach(element => table.appendChild(element))
    });

    renderNav();
}

const renderEvent = (event) => {
    const dateTime = new Date(event.dateTime);
    
    const tr1 = document.createElement("tr");
    const tdWeekDay = document.createElement("td");
    tdWeekDay.textContent = `${dateTime.getDate()} ◦ ${dayStrings[dateTime.getDay()]}`
    tdWeekDay.className = "day"
    tr1.appendChild(tdWeekDay);
    const tdTitle = document.createElement("td");
    const anchor = document.createElement("a")
    anchor.className = "title"
    anchor.textContent = domParser.parseFromString(event.titleFormatted, "text/html").documentElement.textContent;
    anchor.href = event.detailUrl
    anchor.target = "_blank"
    tdTitle.appendChild(anchor)
    tr1.appendChild(tdTitle);

    const tr2 = document.createElement("tr");
    tr2.className = "lastRow";
    const tdTime = document.createElement("td");
    const start = new Date(event.dateTime);
    const end = new Date(event.endDateTime);
    tdTime.textContent = `${start.toLocaleTimeString("de", { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString("de", { hour: "2-digit", minute: "2-digit" })}`;
    tr2.appendChild(tdTime);
    const tdLocation = document.createElement("td");
    tdLocation.textContent = event.locationFormatted
    tr2.appendChild(tdLocation);

    return [tr1, tr2]
}

const renderNav = () => {
    const navRow = document.getElementById("navRow");
    navRow.innerHTML = "";

    const left = document.createElement("button");
    left.textContent = "<";
    left.onclick = () => navigate(-1);
    left.disabled = selectedMonth <= 0;
    navRow.appendChild(left);

    const right = document.createElement("button");
    right.textContent = ">";
    right.onclick = () => navigate(1);
    right.disabled = selectedMonth >= lastMonth;
    navRow.appendChild(right);

    return navRow;
}

const navigate = (i) => {
    selectedMonth += i;
    renderCalendar();
}

globalThis.main = async function() {
    console.log("loaded")

    await loadEvents()
    selectedMonth = 1
    renderCalendar()
}