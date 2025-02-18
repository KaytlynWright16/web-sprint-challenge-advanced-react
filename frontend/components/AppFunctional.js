import React, { useState } from 'react'

export default function AppFunctional(props) {
  const [message, setMessage] = useState(['']);
  const [email, setEmail] = useState(['']);
  const [steps, setSteps] = useState([0]);
  const [index, setIndex] = useState([4]);

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  //use notes from detailed breakdown to understand each task ind. tomorrow!

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

    return x, y;
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const {x, y} = getXY(index); 

    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(4);
    setSteps(0);
    setMessage('');
    setEmail('');
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const {x, y} = getXY(index); 
    let newIndex = index; 
    switch (direction) {
      case 'left':
        if (x > 1) {
          newIndex = index - 1; 
        } else {
          setMessage("You can't go left");
        }
        break; 
        case 'right':
          if (x < 3) {
            newIndex = index + 1; 
          } else {
            setMessage("You can't go right");
          }
          break;
          case 'up':
            if (y > 1) {
              newIndex = index - 3; 
            } else {
              setMessage("You can't go up");
            }
            break;
            case 'down':
              if (y < 3) {
                newIndex = index + 3; 
              } else {
                setMessage("You can't go down");
              }
              break;
              default:
                break;
    }
    return newIndex;
  }

  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const {x, y} = getXY(index); 
    setMessage('');
    let newIndex = index; 

    if (direction === 'left') {
      if (x === 1) {
        setMessage("You can't go left");
        return;
      } else {
        newIndex = index - 1;
      }
    }
    if (direction === 'right') {
      if (x === 3) {
        setMessage("You can't go right");
        return;
      } else {
        newIndex = index + 1;
      }
    }
    if (direction === 'up') {
      if (y === 1) {
        setMessage("You can't go up");
        return;
      } else {
        newIndex = index - 3;
      }
    }
    if (direction === 'down') {
      if (x === 3) {
        setMessage("You can't go down");
        return;
      } else {
        newIndex = index + 3;
      }
    }
    setIndex(newIndex);
    setSteps(steps + 1);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault(); 
    const {x, y} = getXY(index);
    fetch("http://localhost:9000/api/result", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, steps, x, y}), 
    })
    .then(res => res.json())
    .then(data => {
      setMessage(data.message); 
      setEmail('');
    })
    .catch(err => {
      setMessage("Error: " + err.message);
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit" value={email} onChange={onChange}></input>
      </form>
    </div>
  )
}
