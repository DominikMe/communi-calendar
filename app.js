import { generateEvents } from "./sampleData/eventGenerator.js"
import 'dotenv/config'
import express from 'express' 
const app = express()
const port = 3000

app.use(express.static('src'))
app.use(express.static('public'))

app.get('/events', async (req, res) => {
    const response = await fetch(`https://api.communiapp.de/v3/rest/event/?group=${process.env.GROUP_ID}&mainDashboardType=event`, {
        method: 'get',
        headers: {
            'X-Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    })
    const result = await response.json()
    const events = result.filter(x => x.isOfficial)
    events.forEach(x => { x.detailUrl = `https://${process.env.COMMUNI_APP}.communiapp.de/page/detail/tab/event-${x.id}` })
    res.send(events);
})

app.get('/sampleEvents', async (req, res) => {
    const dayInMilliseconds = 24*60*60*1000;
    res.send(generateEvents({
        count: 20,
        startDate: new Date(+new Date() - 21 * dayInMilliseconds),
        millisecondsBetween: 7 * dayInMilliseconds
    }));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})