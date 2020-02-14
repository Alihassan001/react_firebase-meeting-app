import React from "react";

import { findingMatch } from "../../config/firebase";

class Meetings extends React.Component {
  render() {
    return (
      <div>
        <h1>Meetings</h1>
        <button
          onClick={() => {
            findingMatch();
          }}
        >
          finding
        </button>
      </div>
    );
  }
}

export default Meetings;
