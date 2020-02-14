import React from "react";

//Firebase Methods
import { fbLogin, getUser, setUser } from "../../config/firebase";

//import styles
import "./style.css";

class Signin extends React.Component {
  handleSubmit = async () => {
    const { history } = this.props;
    try {
      const response = await fbLogin();
      const { uid, displayName } = response.user;
      localStorage.setItem("userId", uid);
      const user = await getUser(uid);
      if (user.data()) {
        this.checkStage(user.data());
        console.log(user.data());
      } else {
        console.log("first time run");
        await setUser(uid, { displayName, uid });
        localStorage.setItem("stage", "basic");
        history.replace("/profile");
      }
    } catch (error) {
      console.log("TCL: App -> handleSubmit -> error", error);
    }
  };

  checkStage = data => {
    const { history } = this.props;
    console.log(data);
    if (data.registerd) {
      history.replace("/home");
    } else {
      if (!data.nickName || !data.phone) {
        console.log("nName and cell checked");
        localStorage.setItem("stage", "basic");
        history.replace("/profile");
      } else if (!data.profile_images) {
        console.log("imaged checked");
        localStorage.setItem("stage", "image");
        history.replace("/profile");
      } else if (!data.baverages || !data.meeting) {
        localStorage.setItem("stage", "baverages");
        history.replace("/profile");
      } else if (!data.coords) {
        history.replace("/location");
      } else if (!data.coords) {
        history.replace("/location");
      }
    }
  };

  render() {
    return (
      <div className="main">
        <div className="wrapper">
          <h1>MEETING APP</h1>
          <button onClick={this.handleSubmit}>Login with Facebook</button>
        </div>
      </div>
    );
  }
}

export default Signin;
