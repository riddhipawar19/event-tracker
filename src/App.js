import React, { useState, useEffect } from 'react';
import MyComponent from './components/MyComponent';
import GeolocationExample from './components/GeolocationExample';

function App() {

  const [userEvents, setUserEvents] = useState([]);
  const user = "USER 1";

  useEffect(() => {
    // Clear localStorage when the component mounts (i.e., on page load/reload)
    localStorage.clear();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(sendDataToServer, 10000); // 10000 milliseconds = 10 seconds
  //     // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, [userEvents]);

  useEffect(() => {
   
    let count = 0;
    const handleUserEvent = (event) => {
      if (event.target.tagName === 'BUTTON' || event.target.tagName === 'IMG') {
        element = event.target.getAttribute('name');
        count += 1;
      }
      const eventType = event.type;
      const eventSource = element;
      const browserName = navigator.userAgent;
      const platform = window.navigator.platform;
      const timestamp = new Date().toLocaleString();

      console.log("Count : ", count);

      const newUserEvent = {
        user,
        eventType,
        eventSource,
        browserName,
        platform,
        timestamp,
      };

      console.log(newUserEvent);

      setUserEvents((prevEvents) => [...prevEvents, newUserEvent]);

    };

    let element = "";
    // Add event listeners
    window.addEventListener('click', handleUserEvent);
    window.addEventListener('scroll', handleUserEvent);
    window.addEventListener('dblclick', handleUserEvent);
    // window.addEventListener('mouseup', handleUserEvent);
    // window.addEventListener('mousemove', handleUserEvent);
    // window.addEventListener('keydown', handleUserEvent);
    // window.addEventListener('keyup', handleUserEvent);
    window.addEventListener('scroll', handleUserEvent);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('click', handleUserEvent);
      window.removeEventListener('scroll', handleUserEvent);
    };
  }, []);

  const sendDataToKafka = () => {

    const socket = new WebSocket('ws:localhost:8080');

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(userEvents));
    });

    socket.addEventListener('message', (event) => {
      // Handle data received from Kafka, if necessary
    });
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
    {/* <Demo/> */}
    <GeolocationExample/>
    <MyComponent/>
    <div className="App">
      <h1>User Behavior Tracker</h1>
      <div>
        <h2>Events:</h2>
        <ul>
          {userEvents.map((event, index) => (
            localStorage.setItem(index, JSON.stringify(event))
          ))}
        </ul>
      </div>
    </div>
    <button onClick={sendDataToKafka}>Store Data</button>
    </>
  );
}

export default App;
