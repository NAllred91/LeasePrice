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
            unitData[d.date] = u.price[date]
        }
    })

    return unitData
}

var getUnitMostRecentPrice = (unit, date) => {
    var value
    _.find(_.reverse(window.data), (d) => {
        var data = d.data.find((i) => i.unit_number === unit)

        if(data) {
            value = data.price[new Date(date).toLocaleDateString().replace(/\//g, '-')]
            return value
        }
    })

    return value
}


export {getAllUnits, getAllAvailableUnits, getAllUnitsArea, getUnitsData, getUnitMostRecentPrice}