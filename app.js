import { generateEvents } from "./sampleData/eventGenerator.js"
import 'dotenv/config'
import express from 'express' 
const app = express()
const port = 3000

app.use(express.static('src'))
app.use(express.static('public'))

const thirtyOneDays = 31 * 24 * 60 * 60 * 1000;

app.get('/events', async (req, res) => {
    const response = await fetch(`https://api.communiapp.de/v3/rest/event/?group=${process.env.GROUP_ID}&mainDashboardType=event`, {
        method: 'get',
        headers: {
            'X-Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    })
    const result = await response.json()
    const events = result
        .filter(x => x.isOfficial)
        .filter(x => Date.now() - Date.parse(x.dateTime) <= thirtyOneDays)
        .sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime))
    events.forEach(x => { x.detailUrl = `https://${process.env.COMMUNI_APP}.communiapp.de/page/detail/tab/event-${x.id}` })
    res.send(events);
})

app.get('/sampleEvents', async (req, res) => {
    const dayInMinutes = 24*60;
    res.send(generateEvents({
        count: 20,
        startDate: new Date(+new Date() - 19 * dayInMinutes),
        minutesBetween: 7 * dayInMinutes
    }));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})