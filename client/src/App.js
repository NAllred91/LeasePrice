import React from 'react';
import './App.css';
import getRawData from './getRawData'

class App extends React.Component {
  constructor(props) {
    super(props)
    getRawData().then(data => {
      console.log(data)
    })
  }

  render() {
    return <div>hello</div>
  }
}

export default App;
