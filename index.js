var request = require('request')
var async = require('async')
var fs = require('fs')

var getData = () => {
    request('https://sightmap.com/app/api/v1/5rxwj9yxp1e/sightmaps/956', (err, response, body) => {
        var units = JSON.parse(body).data.units.map((unit) => ({
            id: unit.id,
            unit_number: unit.unit_number
        }))
        async.mapLimit(units, 3, (unit, callback) => {
            request(`https://sightmap.com/app/api/v1/5rxwj9yxp1e/leasing/669/unit/${unit.id}?sightmap_id=956&date=2020-02-19`, (err, response, body) => {
                var yearLease = JSON.parse(body).data.options.find((option) => option.lease_term === 12)
                if(!yearLease) {
                    return callback()
                }

                var yearLeasePrice = Number(yearLease.display_price.replace('$', '').replace(',', ''))
                unit.price = yearLeasePrice
                callback(undefined, unit)
            })
        }, (err, result) => {
            result = result.filter((r) => r !== undefined)
            fs.writeFileSync('data/' + new Date().getTime() + '.json', JSON.stringify({
                date: new Date().getTime(),
                data: result
            }))
        })

    })
}

getData()