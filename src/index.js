let events = []
let page = 0
const eventsPerPage = 3

const dayStrings = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
const monthStrings = ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"]

const loadEvents = async () => {
    const response = await fetch('/sampleEvents', {
        method: 'get'
    })
    events = await response.json()
}

const renderCalendar = () => {
    const table = document.getElementById('calendar');
    table.innerHTML = "";
    events.forEach(event => {
        renderEvent(event).forEach(element => table.appendChild(element))
    });
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

globalThis.main = async function() {
    console.log("loaded")

    await loadEvents()
    renderCalendar()
}