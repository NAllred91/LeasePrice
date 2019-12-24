import React from 'react';
import './App.css';
import getRawData from './getRawData'
import _ from 'lodash'
import { LineChart } from 'react-chartkick'
import 'chart.js'
import {getAllUnits, getUnitsData, getAllUnitsArea, getAllAvailableUnits, getUnitMostRecentPrice} from './utils'

class App extends React.Component {
  state = {
    hasData: false,
    moveInDate: 13,
    units: [],
  }

  constructor(props) {
    super(props)
    getRawData().then(data => {
      window.data = data
      window.allUnitsArea = getAllUnitsArea()
      window.allUnits = getAllUnits()
      window.allAvailableUnits = getAllAvailableUnits()
      this.setState({
        hasData: true,
        units: getAllUnits()
      })
    })
  }

  render() {
    if(!this.state.hasData) return <div>Loading....</div>
    return (
      <div>
        February <select value={this.state.moveInDate} onChange={(e) => {
          this.setState({moveInDate: e.target.value})
        }}>
          {[4, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(i => <option value={i}>{i}</option>)}
        </select>
        <img style={{
          height: '460px',
          float: 'right',
          'margin-right': '30%'
        }}src={'map.png'}></img>

        <div>
          <button onClick={() => {
            if(this.state.units.length) {
              this.setState({units: []})
            }
            else {
              this.setState({
                units: getAllUnits()
              })
            }
          }}>Toggle</button>
          <div>Available:</div>
          {window.allAvailableUnits.map(unit => (
            <div>{unit + ': ' + window.allUnitsArea[unit] + ' : $' + (getUnitMostRecentPrice(unit, this.state.moveInDate) || '---')}
              <input type='checkbox' checked={this.state.units.includes(unit)} onChange={(e) => {
                var newUnits = this.state.units
                if(e.target.checked) {
                  newUnits.push(unit)
                  newUnits = _.uniq(newUnits)
                }
                else {
                  newUnits = _.without(newUnits, unit)
                }

                this.setState({units: newUnits})
              }}></input>
            </div>
          ))}
          <div>Unavailable:</div>
          {window.allUnits.filter(unit => !window.allAvailableUnits.includes(unit)).map(unit => (
            <div>{unit + ': ' + window.allUnitsArea[unit]}
            <input type='checkbox' checked={this.state.units.includes(unit)} onChange={(e) => {
                var newUnits = this.state.units
                if(e.target.checked) {
                  newUnits.push(unit)
                  newUnits = _.uniq(newUnits)
                }
                else {
                  newUnits = _.without(newUnits, unit)
                }

                this.setState({units: newUnits})
              }}></input>
            </div>
          ))}
        </div>


        <LineChart
          data={this.state.units.map(unit => ({
            name: unit,
            data: getUnitsData(unit, this.state.moveInDate)
          }))}
        />
      </div>
    )
  }
}

export default App;
