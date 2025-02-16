let events = []
let pageOffset = 0
const eventsPerPage = 3

const dayStrings = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
const monthStrings = ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"]

const route = "/events";
const testRoute = "/sampleEvents";

const loadEvents = async () => {
    const response = await fetch(route, {
        method: 'get'
    })
    // we're assuming they are chronologically sorted
    events = await response.json()
}

const renderCalendar = (offset) => {
    const table = document.getElementById('calendar');
    table.innerHTML = "";

    if (offset == undefined) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        let i = events.findIndex(x => new Date(x.dateTime) >= now);
        if (i == -1) {
            // no future events, we'll render only the last event from the past
            pageOffset = events.length - 1;
        }
        else {
            pageOffset = i;
        }
    }
    else {
        pageOffset = offset;
    }

    events.slice(Math.max(0, pageOffset), pageOffset + eventsPerPage).forEach(event => {
        renderEvent(event).forEach(element => table.appendChild(element))
    });

    table.appendChild(renderNav());
}

const renderEvent = (event) => {
    const dateTime = new Date(event.dateTime);
    
    const tr1 = document.createElement("tr");
    const tdMonth = document.createElement("td");
    tdMonth.textContent = monthStrings[dateTime.getMonth()]
    tdMonth.className = "month"
    tr1.appendChild(tdMonth);
    const tdTitle = document.createElement("td");
    const anchor = document.createElement("a")
    anchor.className = "title"
    anchor.textContent = event.titleFormatted
    anchor.href = event.detailUrl
    anchor.target = "_blank"
    tdTitle.appendChild(anchor)
    tr1.appendChild(tdTitle);

    const tr2 = document.createElement("tr");
    const tdDay = document.createElement("td");
    tdDay.textContent = dateTime.getDate()
    tr2.appendChild(tdDay);
    const tdDate = document.createElement("td");
    tdDate.textContent = `${dateTime.getDate()}.${dateTime.getMonth() + 1}.${dateTime.getFullYear()}`
    tr2.appendChild(tdDate);

    const tr3 = document.createElement("tr");
    tr3.className = "lastRow";
    tr3.appendChild(document.createElement("td"));
    const tdLocation = document.createElement("td");
    tdLocation.textContent = event.locationFormatted
    tr3.appendChild(tdLocation);

    return [tr1, tr2, tr3]
}

const renderNav = () => {
    const tr = document.createElement("tr");
    tr.className = "navRow";
    tr.appendChild(document.createElement("td"));
    const tdNav = document.createElement("td");

    const left = document.createElement("button");
    left.textContent = "<";
    left.onclick = () => navigate(pageOffset - eventsPerPage);
    left.disabled = pageOffset <= 0;
    tdNav.appendChild(left);

    const right = document.createElement("button");
    right.textContent = ">";
    right.onclick = () => navigate(pageOffset + eventsPerPage);
    right.disabled = pageOffset + eventsPerPage >= events.length;
    tdNav.appendChild(right);
    
    tr.appendChild(tdNav);

    return tr;
}

const navigate = (offset) => {
    renderCalendar(Math.min(events.length - 1, offset));
}

globalThis.main = async function() {
    console.log("loaded")

    await loadEvents()
    renderCalendar()
}