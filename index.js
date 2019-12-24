var request = require('request')
var async = require('async')
var fs = require('fs')
var express = require('express')
var app = express()

app.use(express.static('data'))
app.listen(3000)

var getData = () => {
    request('https://sightmap.com/app/api/v1/5rxwj9yxp1e/sightmaps/956', (err, response, body) => {
        var units = JSON.parse(body).data.units.map((unit) => ({
            id: unit.id,
            unit_number: unit.unit_number,
            area: unit.area,
        }))
        async.mapLimit(units, 2, (unit, callback) => {
            async.mapLimit([14, 17, 19, 21, 24, 26], 3, (day, callback) => {
                getPrice(unit, day, callback)
            }, (err, result) => {
                callback(err, unit)
            })
        }, (err, result) => {
            result = result.filter((r) => r !== undefined)
            var timestamp = new Date().getTime()
            var toc = JSON.parse(fs.readFileSync('data/toc.json'))
            toc.timestamps.push(timestamp)
            fs.writeFileSync('data/toc.json', JSON.stringify(toc))
            fs.writeFileSync('data/' + timestamp + '.json', JSON.stringify({
                date: timestamp,
                data: result
            }))
        })
    })
}

var getPrice = (unit, day, callback) => {
    request(`https://sightmap.com/app/api/v1/5rxwj9yxp1e/leasing/669/unit/${unit.id}?sightmap_id=956&date=2020-02-${day}`, (err, response, body) => {
        var yearLease = JSON.parse(body).data.options.find((option) => option.lease_term === 12)
        if(!yearLease) {
            return callback()
        }

        var yearLeasePrice = Number(yearLease.display_price.replace('$', '').replace(',', ''))
        unit.price = unit.price || {}
        unit.price[day] = yearLeasePrice
        callback(undefined, unit)
    })
}

getData()

setInterval(getData, 3600000)