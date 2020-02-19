import React from "react";

//Firebase Methods
import { getAllMeetings, logout } from "../../config/firebase";

//import styles
import "./style.css";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      meetings: []
    };
  }
  UNSAFE_componentWillMount() {
    this.checkLoginStatus();
  }

  componentDidMount() {
    this.checkMeetings();
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
    history.push("/meetings");
  };

  checkMeetings = async () => {
    const userId = localStorage.getItem("userId");
    const temp = [];

    try {
      const response = await getAllMeetings(userId);
      if (response.size) {
        response.forEach(doc => {
          temp.push({ ...doc.data(), docId: doc.id });
        });
        this.setState({
          meetings: temp,
          loader: false
        });
      } else {
        this.setState({
          loader: false,
          meetings: temp
        });
      }
    } catch (error) {
      this.setState({
        loader: false,
        meetings: []
      });
      console.log(error);
    }
  };

  render() {
    const { loader, meetings } = this.state;

    return (
      <div className="main-wrap">
        <div className="nav">
          <button onClick={this.handleLogout}>Logout!</button>
        </div>
        <div className="content">
          <React.Fragment>
            {loader ? (
              <p>Loading</p>
            ) : (
              <React.Fragment>
                {!meetings.length ? (
                  <p>You don't have any meeting yet!</p>
                ) : (
                  <React.Fragment>
                    {meetings.map((val, ind) => {
                      return <p>{ind}</p>;
                    })}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
          <button onClick={this.setMeeting}>Set a Meeting!</button>
        </div>
      </div>
    );
  }
}

export default Home;
