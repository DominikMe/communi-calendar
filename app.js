import { generateEvents } from "./sampleData/eventGenerator.js"
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fetchCommuniEvents } from "./communi.js"
const app = express()
const port = 3000

app.use(express.static('src'))
app.use(express.static('public'))
app.use(cors())

app.get('/events', async (req, res) => {
    events = await fetchCommuniEvents()
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