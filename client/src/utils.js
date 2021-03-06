import _ from 'lodash'

var getAllUnits = () => {
    var units = {}
    window.data.forEach((d) => d.data.forEach(unit => units[unit.unit_number] = true))

    return Object.keys(units)
}

var getAllUnitsArea = () => {
    var units = {}
    window.data.forEach((d) => d.data.forEach(unit => units[unit.unit_number] = unit.area))

    return units
}

var getAllAvailableUnits = () => {
    return window.data[window.data.length - 1].data.map(unit => unit.unit_number)
}

var getUnitsData = (unit, date) => {
    var unitData = {}
    window.data.forEach((d) => {
        var u = d.data.find((i) => i.unit_number === unit)
        if(u) {
            var dateObj = new Date(d.date)
            var value = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1) + '-' + dateObj.getDate()
            unitData[value] = u.price[date]
        }
    })

    return unitData
}

var getUnitMostRecentPrice = (unit, date) => {
    var value
    _.find(_.reverse(_.clone(window.data)), (d) => {
        var data = d.data.find((i) => i.unit_number === unit)

        if(data) {
            value = data.price[date]
            return data.price[date]
        }
    })

    return value
}

var getUnitPrices = (unit, date) => {
    return _.compact(window.data.map((d) => {
        var data = d.data.find((i) => i.unit_number === unit)

        if(data) {
            return data.price[date]
        }
    }))
}


export {getAllUnits, getAllAvailableUnits, getAllUnitsArea, getUnitsData, getUnitMostRecentPrice, getUnitPrices}