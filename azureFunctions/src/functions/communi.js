const thirtyOneDays = 31 * 24 * 60 * 60 * 1000;

export const fetchCommuniEvents = async () => {
    const response = await fetch(`https://api.communiapp.de/v3/rest/event/?group=${process.env.GROUP_ID}&mainDashboardType=event`, {
        method: 'get',
        headers: {
            'X-Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    });
    const result = await response.json();
    const events = result
        .filter(x => x.isOfficial)
        .filter(x => Date.now() - Date.parse(x.dateTime) <= thirtyOneDays)
        .sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime));
    events.forEach(x => { x.detailUrl = `https://${process.env.COMMUNI_APP}.communiapp.de/page/detail/tab/event-${x.id}`; });
    return events;
};