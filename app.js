require('dotenv').config()
const express = require('express')
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
    res.send(events);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})