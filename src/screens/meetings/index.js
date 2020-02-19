import React from "react";

import { db, getUser } from "../../config/firebase";

import { Card, CardWrapper } from "react-swipeable-cards";
import { Camera } from "react-feather";

//import styles
import "./style.css";
import IMG from "./myPic.jpg";

class Meetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loader: true,
      myData: {}
    };
  }

  UNSAFE_componentWillMount() {
    this.loginStatus();
  }

  componentDidMount() {
    // this.findingMatch();
    this.getMyData();
  }

  allUsers = async () => {
    const { myData } = this.state;
    const { baverages: myBaverages, meeting: myMeeting } = myData;
    try {
      let temp = [];
      const response = await db.collection("aliUsers").get();
      if (response.size) {
        response.forEach(doc => {
          let foundBavereges = false;
          let foundMeeting = false;
          if (myData.uid !== doc.data().uid) {
            const { baverages, meeting } = doc.data();
            if (myBaverages.length > baverages.length) {
              for (let i = 0; i < myBaverages.length; i++) {
                if (baverages.includes(myBaverages[i])) {
                  foundBavereges = true;
                  break;
                }
              }
            } else {
              for (let i = 0; i < baverages.length; i++) {
                if (myBaverages.includes(baverages[i])) {
                  foundBavereges = true;
                  break;
                }
              }
            }

            if (myMeeting.length > meeting.length) {
              for (let i = 0; i < myMeeting.length; i++) {
                if (meeting.includes(myMeeting[i])) {
                  foundMeeting = true;
                  break;
                }
              }
            } else {
              for (let i = 0; i < meeting.length; i++) {
                if (myBaverages.includes(meeting[i])) {
                  foundMeeting = true;
                  break;
                }
              }
            }
            if (foundBavereges) {
              temp.push({ ...doc.data(), docId: doc.id });
            }
          }
        });
        this.setState({ users: temp, loader: false }, () => {
          this.calculateDistance();
        });
      } else {
        this.setState({ users: temp, loader: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  calculateDistance = (unit = "K") => {
    let temp = [];
    const { users } = this.state;
    const {
      coords: { latitude: lat1, longitude: lon1 }
    } = this.state.myData;

    if (users.length) {
      users.map((val, ind) => {
        const { latitude: lat2, longitude: lon2 } = val.coords;

        if (lat1 === lat2 && lon1 === lon2) {
          return 0;
        } else {
          var radlat1 = (Math.PI * lat1) / 180;
          var radlat2 = (Math.PI * lat2) / 180;
          var theta = lon1 - lon2;
          var radtheta = (Math.PI * theta) / 180;
          var dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = (dist * 180) / Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit === "K") {
            dist = dist * 1.609344;
          }
          if (unit === "N") {
            dist = dist * 0.8684;
          }

          if (dist <= 13) {
            temp.push(val);
          }
        }
      });
    }
  };

  getMyData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const doc = await getUser(userId);
      this.setState(
        {
          myData: doc.data()
        },
        () => {
          this.allUsers();
          this.calculateDistance();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  rejectUser = ind => {
    let { users } = this.state;
    users.splice(ind, 1);
    this.setState({ users });
  };

  loginStatus = () => {
    const { history } = this.props;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      history.replace("/");
    }
  };

  // findingMatch = () => {
  //   let userData = [];
  //   db.collection("aliUsers")
  //     .get()
  //     .then(users => {
  //       users.forEach(doc => {
  //         if (doc.data().uid !== localStorage.getItem("userId")) {
  //           // console.log(doc.data());
  //           userData.push({
  //             baverage: doc.data().baverages,
  //             coords: doc.data().coords,
  //             Display_Name: doc.data().displayName,
  //             meetings: doc.data().meeting,
  //             Nick_Name: doc.data().nickName,
  //             Profile_imges: doc.data().profile_images,
  //             uId: doc.data().uid
  //           });
  //         }
  //       });
  //       this.setState({ users: userData });
  //     });
  // };

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
