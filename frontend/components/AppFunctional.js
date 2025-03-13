import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  
  //setting state
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordX = (index % 3) + 1;
    const coordY = Math.floor(index / 3) + 1;
    return {coordX, coordY};
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const {coordX, coordY} = getXY();
    return `Coordinates (${coordX}, ${coordY})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex);
    setEmail(initialEmail);
    setMessage(initialMessage);
    setSteps(initialSteps);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = index;
    if (direction === 'right' && index % 3 !== 2) {
      newIndex += 1;
    } else if (direction === 'left' && index % 3 !== 0) {
      newIndex -= 1;
    } else if (direction === 'up' && index > 2) {
      newIndex -= 3;
    } else if (direction === 'down' && index < 6) {
      newIndex += 3;
    } else {
      setMessage(`You can't go ${direction}`)
    }
    return newIndex;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id; 
    const newIndex = getNextIndex(direction);
    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage('');
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
   setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

   
    if(!email) {
      setMessage('Ouch: email is required');
      return;
    } 

    const regEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    

    if (!regEx.test(email.trim())) {
      console.log('invalid email detected', email.trim());
      setMessage('Ouch: email must be a valid email');
      return;
    } 

    

    if (email.trim() === 'foo@bar.bar') {
      setMessage('foo@bar.bar failure #71');
      return;
    }

    const { coordX, coordY } = getXY();
    const payload = {
      x: coordX,
      y: coordY,
      steps: steps,
      email: email
    }

    try {
      const response = await fetch("http://localhost:9000/api/result", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
     
      const result = await response.text(); 

     
      if (response.ok) {
        setMessage(result.trim());
      } else {
        setMessage(`Error: ${result.trim()}`); 
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setEmail(initialEmail)
  } 

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message || ''}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
