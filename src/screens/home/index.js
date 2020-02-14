import React from "react";

//Firebase Methods
import { logout } from "../../config/firebase";

//import styles
import "./style.css";

class Home extends React.Component {
  UNSAFE_componentWillMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus = () => {
    const { history } = this.props;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      history.replace("/");
    }
  };

  handleLogout = async () => {
    const { history } = this.props;
    try {
      await logout();
      localStorage.removeItem("userId");
      history.replace("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  setMeeting = () => {
    const { history } = this.props;
    history.replace("/meetings");
  };
  render() {
    return (
      <div className="main-wrap">
        <div className="nav">
          <button onClick={this.handleLogout}>Logout!</button>
        </div>
        <div className="content">
          <p>You haven't done any meeting yet! </p>
          <button onClick={this.setMeeting}>Set a Meeting!</button>
        </div>
      </div>
    );
  }
}

export default Home;
