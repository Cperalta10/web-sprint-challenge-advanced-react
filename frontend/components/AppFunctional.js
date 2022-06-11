import React, { useState } from "react";
import axios from "axios";

// Suggested initial states
// const initialMessage = "";
// const initialEmail = "";
// const initialSteps = 1;
// const initialIndex = 2; // the index the "B" is at

const url = "http://localhost:9000/api/result";

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  // const [initialMessage, setInitialMessage] = useState(initialMessage);
  // const [initialEmail, setInitialEmail] = useState(initialEmail);
  // const [initialSteps, setInitialSteps] = useState(initialSteps);
  // const [initialIndex, setInitialIndex] = useState(initialIndex);
  const [state, setState] = useState({
    message: "",
    email: "",
    index: 4,
    steps: 0,
  });

  function getXY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    switch (index) {
      case 0:
        return "(1,1)";
        break;
      case 1:
        return "(2,1)";
        break;
      case 2:
        return "(3,1)";
        break;
      case 3:
        return "(1,2)";
        break;
      case 4:
        return "(2,2)";
        break;
      case 5:
        return "(3,2)";
        break;
      case 6:
        return "(1,3)";
        break;
      case 7:
        return "(2,3)";
        break;
      case 8:
        return "(3,3)";
        break;
    }
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return getXY(state.index);
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setState({
      message: "",
      email: "",
      index: 4,
      steps: 0,
    });
  }

  const getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "left") {
      if (state.index - 1 >= 0) {
        setState({
          ...state,
          index: state.index - 1,
          steps: state.steps + 1,
        });
      } else {
        setState({ ...state, message: "You can't go left" });
      }
    } else if (direction === "right") {
      if (state.index + 1 <= 8) {
        setState({
          ...state,
          index: state.index + 1,
          steps: state.steps + 1,
        });
      } else {
        setState({ ...state, message: "You can't go right" });
      }
    } else if (direction === "up") {
      if (state.index - 3 >= 0) {
        setState({
          ...state,
          index: state.index - 3,
          steps: state.steps + 1,
        });
      } else {
        setState({ ...state, message: "You can't go up" });
      }
    } else if (direction === "down") {
      if (state.index + 3 <= 8) {
        setState({
          ...state,
          index: state.index + 3,
          steps: state.steps + 1,
        });
      } else {
        setState({ ...state, message: "You can't go down" });
      }
    }
  };

  const move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt.target.id);
  };

  const onChange = (evt) => {
    // You will need this to update the value of the input.
    setState({
      ...state,
      email: evt.target.value,
    });
  };

  const onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const getXYCord = getXY(state.index);

    evt.preventDefault();
    axios
      .post(url, {
        x: `${getXYCord[1]}`,
        y: `${getXYCord[3]}`,
        steps: `${state.steps}`,
        email: `${state.email}`,
      })
      .then((res) => {
        console.log(res.data.message);
        setState({
          ...state,
          message: res.data.message,
        });
      });
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXYMessage()}</h3>
        <h3 id="steps">You moved {state.steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === state.index ? " active" : ""}`}
          >
            {idx === state.index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">
          LEFT
        </button>
        <button onClick={move} id="up">
          UP
        </button>
        <button onClick={move} id="right">
          RIGHT
        </button>
        <button onClick={move} id="down">
          DOWN
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={state.email}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
