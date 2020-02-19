import React from "react";

import { db } from "../../config/firebase";

import { Card, CardWrapper } from "react-swipeable-cards";
import { Camera } from "react-feather";

//import styles
import "./style.css";
import IMG from "./myPic.jpg";

class Meetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    this.findingMatch();
  }

  rejectUser = ind => {
    let { users } = this.state;
    users.splice(ind, 1);
    this.setState({ users });
  };

  findingMatch = () => {
    let userData = [];
    db.collection("aliUsers")
      .get()
      .then(users => {
        users.forEach(doc => {
          if (doc.data().uid !== localStorage.getItem("userId")) {
            // console.log(doc.data());
            userData.push({
              baverage: doc.data().baverages,
              coords: doc.data().coords,
              Display_Name: doc.data().displayName,
              meetings: doc.data().meeting,
              Nick_Name: doc.data().nickName,
              Profile_imges: doc.data().profile_images,
              uId: doc.data().uid
            });
          }
        });
        this.setState({ users: userData });
      });
  };
  render() {
    let { users } = this.state;
    console.log(users);
    return (
      <div className="main">
        <CardWrapper>
          {users.map((val, ind) => {
            // console.log(val.Profile_imges);
            return (
              <Card
                key={ind}
                style={{ position: "fixed" }}
                onSwipeLeft={() => {
                  return this.rejectUser(ind);
                }}
              >
                <div className="card">
                  <img src={IMG} className="img-area" alt="profile-img" />
                  <div className="options">
                    <p
                      onClick={() => {
                        return this.rejectUser(ind);
                      }}
                    >
                      Cancel
                    </p>
                    <div className="user-info">
                      <p>{val.Display_Name}</p>
                      <p>{val.Nick_Name}</p>
                    </div>
                    <p>Accept</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </CardWrapper>
      </div>
    );
  }
}

export default Meetings;
