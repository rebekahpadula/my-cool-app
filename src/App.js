import React, { Component } from 'react';
import './App.css';

import firebase from 'firebase';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      outings: [
        {
          activity: 'trivia',
          place: 'The Grand on Main',
          note: 'This is my note',
          date: 'December 15, 2018',
          time: 'ugh',
          userVoted: false,
          key: 1
        }
      ]
    };

    this.createNewOuting = this.createNewOuting.bind(this);
    this.vote = this.vote.bind(this);
    this.writeInitialData = this.writeInitialData.bind(this);
  }

  createNewOuting(newOuting) {
      newOuting = {
        activity: document.getElementById('activity').value,
        place: document.getElementById('place').value,
        note: document.getElementById('note').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        userVoted: false,
        key: this.state.outings.length + 1
      }
      
      this.setState({outings: [...this.state.outings, newOuting]});
      document.getElementById('activity').value = '';
      document.getElementById('place').value = '';
      document.getElementById('note').value = '';
      document.getElementById('date').value = '';
      document.getElementById('time').value = '';
    }

    vote(key, outing) {
        if(outing.userVoted === false) {
          this.setState({
            outings: this.state.outings.map(outing => {
              return outing.key === key ? {...outing, userVoted: true} : outing;
            })
          })
        } else {
          this.setState({
            outings: this.state.outings.map(outing => {
              return outing.key === key ? {...outing, userVoted: false} : outing;
            })
          })
        }
    }

    writeInitialData() {
      firebase.database().ref('/').set({
        outings: this.state
      })
    }

    componentDidMount() {
      // Set the configuration for your app
      var config = {
        apiKey: "apiKey",
        authDomain: "projectId.firebaseapp.com",
        databaseURL: "https://purple-meerkat.firebaseio.com",
        storageBucket: "bucket.appspot.com"
      };
      firebase.initializeApp(config);

      // Get a reference to the database service
      var database = firebase.database();

      this.writeInitialData()
    }

    componentDidUpdate() {
      console.log(this.state);
    }

  render() {
    return (
      <div className="App">
        {this.state.outings.map(outing => 
          <div key={this.key}>
            <p>{outing.activity}</p>
            <p>{outing.place}</p>
            <p>{outing.note}</p>
            <p>{outing.date}</p>
            <p>{outing.time}</p>
            <button onClick={() => this.vote(outing.key, outing)}>
              Vote for dis: <span>{outing.votes}</span>
            </button>
          </div>
          )}
          <div className="input-group">
            <label htmlFor="activity">Activity</label>
            <input type="text" id="activity"></input>
          </div>
          <div className="input-group">
            <label htmlFor="place">Place</label>
            <input type="text" id="place"></input>
          </div>
          <div className="input-group">
            <label htmlFor="note">Note</label>
            <input type="text" id="note"></input>
          </div>
          <div className="input-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date"></input>
          </div>
          <div className="input-group">
            <label htmlFor="time">Time</label>
            <input type="time" id="time"></input>
          </div>
          <button onClick={() => this.createNewOuting()}>
            Create New
          </button>
      </div>
    );
  }
}

export default App;
