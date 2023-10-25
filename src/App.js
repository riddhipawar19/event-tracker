import React, { useState, useEffect } from 'react';
import MyComponent from './components/MyComponent';
import GeolocationExample from './components/GeolocationExample';
import axios from 'axios';

function App() {

  localStorage.setItem("demo_1", "demo1");
  localStorage.setItem("demo_2", "demo2");
  localStorage.setItem("demo_3", "demo3");

  const [userEvents, setUserEvents] = useState([]);

  const user = "USER 1";

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(sendDataToKafka, 10000); // 10000 milliseconds = 10 seconds
    return () => clearInterval(intervalId);
  }, [userEvents]);

  useEffect(() => {
   
    const handleUserEvent = (event) => {
      if (event.target.tagName === 'BUTTON' || event.target.tagName === 'IMG') {
        // element = event.target.getAttribute('name');
        element = event.target.textContent;
      }

      const eventType = event.type;
      const eventSource = element;
      const browserName = navigator.userAgent;
      const platform = window.navigator.platform;
      const timestamp = new Date().toLocaleString();
      const demo_field = 100;

      // const latitude = localStorage.getItem("latitude");
      // const longitude = localStorage.getItem("longitude");

      // console.log(latitude, longitude);
     
      const newUserEvent = {
        user,
        eventType,
        eventSource,
        browserName,
        platform,
        timestamp,
        demo_field,
      };

      console.log(newUserEvent);

      setUserEvents((prevEvents) => [...prevEvents, newUserEvent]);

    };

    let element = "";
    window.addEventListener('click', handleUserEvent);
    window.addEventListener('scroll', handleUserEvent);
    window.addEventListener('dblclick', handleUserEvent);

    return () => {
      window.removeEventListener('click', handleUserEvent);
      window.removeEventListener('scroll', handleUserEvent);
    };
  }, [userEvents]);

  const sendDataToKafka = () => {
    if (localStorage.length != 0) {
      
      const socket = new WebSocket('ws:localhost:8081');

      socket.addEventListener('open', (event) => {
        socket.send(JSON.stringify(userEvents));
        console.log("Data sent..");

        var arr = []; 
        for (var i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).startsWith("event_")) {
            arr.push(localStorage.key(i));
          }
        }

        for (var i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }
        
        axios.get("http://localhost:8080/consume")
        .then(() => {
          console.log("Data consumed..");
        })
      });
      
    }
    else{
      console.log("Local storage is empty..");
    }

  }

  const clearStorage = () => {
    window.localStorage.clear();
  }

  const sendDataToServer = () => {

    console.log(localStorage.length);
    if (localStorage.length != 0) {

      fetch('http://localhost:3001/sendData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userEvents),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Data sent successfully.');
            localStorage.clear();
            console.log('Storage cleared successfully.');
          } else {
            console.error('Error sending data to server.');
          }
        })
        .catch((error) => {
          console.error('Error sending data to server:', error);
        });
    }
    else{
      console.log("Local storage is empty..");
    }
  };

  return (<>
    <GeolocationExample/>
    <MyComponent/>
    <div className="App">
      <h1>User Behavior Tracker</h1>
      <div>
        <h2>Events:</h2>
        <ul>
          {userEvents.map((event, index) => (
            localStorage.setItem("event_" + index, JSON.stringify(event))
          ))}
        </ul>
      </div>
    </div>
    <button onClick={sendDataToKafka}>Store Data</button>
    <button onClick={clearStorage} type='button'>Clear Storage</button>
    </>
  );
}

export default App;
