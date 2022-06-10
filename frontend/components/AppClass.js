import React from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

const url = "http://localhost:9000/api/result";

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  };

  getXY = (index) => {
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
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return this.getXY(this.state.index);
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "left") {
      if (this.state.index - 1 >= 0) {
        this.setState({
          ...this.state,
          index: this.state.index - 1,
          steps: this.state.steps + 1,
        });
      } else {
        this.setState({ ...this.state, message: "You can't go left" });
      }
    } else if (direction === "right") {
      if (this.state.index + 1 <= 8) {
        this.setState({
          ...this.state,
          index: this.state.index + 1,
          steps: this.state.steps + 1,
        });
      } else {
        this.setState({ ...this.state, message: "You can't go right" });
      }
    } else if (direction === "up") {
      if (this.state.index - 3 >= 0) {
        this.setState({
          ...this.state,
          index: this.state.index - 3,
          steps: this.state.steps + 1,
        });
      } else {
        this.setState({ ...this.state, message: "You can't go up" });
      }
    } else if (direction === "down") {
      if (this.state.index + 3 <= 8) {
        this.setState({
          ...this.state,
          index: this.state.index + 3,
          steps: this.state.steps + 1,
        });
      } else {
        this.setState({ ...this.state, message: "You can't go down" });
      }
    }
  };

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.getNextIndex(evt.target.id);
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      ...this.state,
      email: evt.target.value,
    });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const getXYCord = this.getXY(this.state.index);

    evt.preventDefault();
    axios
      .post(url, {
        x: `${getXYCord[1]}`,
        y: `${getXYCord[3]}`,
        steps: `${this.state.steps}`,
        email: `${this.state.email}`,
      })
      .then((res) => {
        console.log(res.data.message);
        this.setState({
          ...this.state,
          message: res.data.message,
        });
      });
  };

  render() {
    const { className } = this.props;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">
            LEFT
          </button>
          <button onClick={this.move} id="up">
            UP
          </button>
          <button onClick={this.move} id="right">
            RIGHT
          </button>
          <button onClick={this.move} id="down">
            DOWN
          </button>
          <button onClick={this.reset} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            value={this.state.email}
            id="email"
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
