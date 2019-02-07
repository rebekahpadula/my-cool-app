import React, { Component } from 'react';
import './App.scss';

import firebase from 'firebase';
import firebaseui from 'firebaseui';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
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

    this.signUpWithEmailAndPassword = this.signUpWithEmailAndPassword.bind(this);
    this.signInWithEmailandPassword = this.signInWithEmailandPassword.bind(this);
    this.signOut = this.signOut.bind(this);
    this.createNewOuting = this.createNewOuting.bind(this);
    this.vote = this.vote.bind(this);
    this.writeInitialData = this.writeInitialData.bind(this);
    this.openSignUpDialog = this.openSignUpDialog.bind(this);
    this.openSignInDialog = this.openSignInDialog.bind(this);
    this.closeSignUpDialog = this.closeSignUpDialog.bind(this);
    this.closeSignInDialog = this.closeSignInDialog.bind(this);
  }

  openSignUpDialog() {
      this.signUpSection.setAttribute("data-dialog-open", true);
  }

  closeSignUpDialog() {
    this.signUpSection.setAttribute("data-dialog-open", false);

    this.signUpEmail.value = '';
    this.signUpPassword1.value = '';
    this.signUpPassword2.value = '';
  }

  openSignInDialog() {
    this.signInSection.setAttribute("data-dialog-open", true);
  }

  closeSignInDialog() {
    this.signInSection.setAttribute("data-dialog-open", false);

    this.signInEmail.value = '';
    this.signInPassword.value = '';
  }

  signUpWithEmailAndPassword(email, password, displayName) {
    email = this.signUpEmail.value;
    let password1 = this.signUpPassword1.value;
    let password2 = this.signUpPassword2.value;
    displayName = this.signUpUsername.value;

    if(password1 === password2) {
      password = password1;
    } else {
      console.log("Passwords must match. You uncultured swine.");
    };

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorCode + ':' + errorMessage);
    });

    this.signUpEmail.value = '';
    this.signUpPassword1.value = '';
    this.signUpPassword2.value = '';

    this.closeSignUpDialog();
  };

  signInWithEmailandPassword(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorCode + ':' + errorMessage);
    });

    this.closeSignInDialog();
  };

  signOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful
      console.log("sign out successful");
    }).catch(function(error) {
      // An error happened
      console.log(error);
    });
  };

  createNewOuting(newOuting) {

      newOuting = {
        activity: this.activity.value,
        place: this.place.value,
        note: this.note.value,
        date: this.date.value,
        time: this.time.value,
        userVoted: false,
        key: this.state.outings.length + 1
      }
      
      this.setState({outings: [...this.state.outings, newOuting]});

      this.activity.value = '';
      this.place.value = '';
      this.note.value = '';
      this.date.value = '';
      this.time.value = '';

      // * Updating firebase *
      // get a key for the new outing
      let newOutingKey = firebase.database().ref().child('outings').push().key;

      // create new object and ?add "url" of new outing to updates object?
      let updates = {};
      updates[newOutingKey] = newOuting;

      return firebase.database().ref().update(updates);
    };

    vote(key, outing) {
        // if(outing.userVoted === false) {
        //   this.setState({
        //     outings: this.state.outings.map(outing => {
        //       return outing.key === key ? {...outing, userVoted: true} : outing;
        //     })
        //   })
        //   // * Updating firebase *
        //   // snapshot must be a keyword?
        //   let query = firebase.database().ref('/').orderByChild('key').equalTo(key);
        //   query.once('child_added', function(snapshot) {
        //     snapshot.ref.update({userVoted: true})
        //   })
        // } else {
          
        //   let query = firebase.database().ref('/').orderByChild('key').equalTo(key);
        //   query.once('child_added', function(snapshot) {
        //       snapshot.ref.update({userVoted: false});
        //     })
        //     }
        // 
          const updatedOutings = this.state.outings.map(outing => {
            return outing.key === key ? {...outing, userVoted: !outing.userVoted} : outing;
          });

          // Something is wrong with the below code. Adds duplicates to database
          // this cannot be right, setting an object updatedOutings to be the value of the outings object? noooo. 
          this.setState({
            outings: updatedOutings
          });
          // * Updating firebase *
          firebase.database().ref().update(updatedOutings);
    };

    writeInitialData() {
      // if you ever have more/different data you WILL WANT to nest your outings like you did previously, so .set({outings: this.state.outings});

      // why doesn't this work...?
      firebase.database().ref('/').set({outings: this.state.outings}, this.state.authUser);
    };

    componentDidMount() {
      // Set the configuration for your app
      const config = {
        apiKey: "AIzaSyDRtOnfxQAIUxX4vXPs6qwA9uJRW59XTjc",
        authDomain: "projectId.firebaseapp.com",
        databaseURL: "https://purple-meerkat.firebaseio.com",
        storageBucket: "bucket.appspot.com"
      };
      firebase.initializeApp(config);

      this.writeInitialData()

      // getting the current user
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("user is signed in");
          console.log(firebase.auth().currentUser);
        } else {
          console.log("no user is signed in");
          // no user is signed in
        }
      })
    };

    componentDidUpdate() {
      console.log(this.state);
    };

  render() {
    return (
      <div className="App">
      <section className="utilities">
        <section className="sign-up" data-dialog-open="false" ref={section => this.signUpSection = section}>
          <div className="sign-up__content">
            <h1>Sign up!</h1>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" ref={input => this.signUpUsername = input}></input>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref={input => this.signUpEmail = input}/>
            </div>
            <div>
              <label htmlFor="password1">Password</label>
              <input type="password" id="password1" ref={input => this.signUpPassword1 = input}/>
            </div>
            <div>
              <label htmlFor="password2">Confirm password</label>
              <input type="password" id="password2" ref={input => this.signUpPassword2 = input}/>
            </div>
            <div className="sign-up__actions">
              <button className="button sign-up__submit" onClick={this.signUpWithEmailAndPassword}>Create Account</button>
              <button className="button sign-up__cancel" onClick={this.closeSignUpDialog}>Cancel</button>
            </div>
          </div>
          <button className="sign-up__button" onClick={this.openSignUpDialog}>Sign up</button>
        </section>
        <section className="sign-out">
          <button className="button" onClick={this.signOut}>Sign out</button>
        </section>
        <section className="sign-in" data-dialog-open="false" ref={section => this.signInSection = section}>
          <div className="sign-in__content">
            <h1>Sign In if you already have an account.</h1>
            <div>
              <label htmlFor="signInEmail">Email</label>
              <input type="email" id="signInEmail" ref={input => this.signInEmail = input}/>
            </div>
            <div>
              <label htmlFor="signInPassword">Password</label>
              <input type="password" id="signInPassword" ref={input => this.signInPassword = input}/>
            </div>
            <div className="sign-in__actions">
              <button className="button sign-in__submit" onClick={this.signInWithEmailAndPassword}>Log In</button>
              <button className="button sign-in__cancel" onClick={this.closeSignInDialog}>Cancel</button>
            </div>
          </div>
          <button className="sign-in__button" onClick={this.openSignInDialog}>Log In</button>
        </section>
      </section>
        {this.state.outings.map(outing => 
          <div className="outing" key={this.key}>
            <p>{outing.activity}</p>
            <p>{outing.place}</p>
            <p>{outing.note}</p>
            <p>{outing.date}</p>
            <p>{outing.time}</p>
            <input type="checkbox" value="Vote for dis:" onClick={() => this.vote(outing.key, outing)}/>
          </div>
          )}
          <div className="input-group">
            <label htmlFor="activity">Activity</label>
            <input ref={input => this.activity = input} type="text" id="activity"></input>
          </div>
          <div className="input-group">
            <label htmlFor="place">Place</label>
            <input ref={input => this.place = input} type="text" id="place"></input>
          </div>
          <div className="input-group">
            <label htmlFor="note">Note</label>
            <input ref={input => this.note = input} type="text" id="note"></input>
          </div>
          <div className="input-group">
            <label htmlFor="date">Date</label>
            <input ref={input => this.date = input} type="date" id="date"></input>
          </div>
          <div className="input-group">
            <label htmlFor="time">Time</label>
            <input ref={input => this.time = input} type="time" id="time"></input>
          </div>
          <button onClick={() => this.createNewOuting()}>
            Create New
          </button>
      </div>
    );
  }
}

export default App;