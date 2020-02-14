import React from "react";

//Firebase Methods
import { setUser, uploadImages } from "../../config/firebase";

//import styles
import "./style.css";

//import from local state
const userId = localStorage.getItem("userId");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: localStorage.getItem("stage"),
      nickName: "",
      phone: "",
      img_one: "",
      img_two: "",
      img_three: "",
      baverages: [],
      meeting: []
    };
  }

  handleState = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleBasic = async () => {
    const { nickName, phone } = this.state;
    if (!nickName || !phone) {
      alert("All fields are required");
      return;
    }

    try {
      await setUser(userId, { nickName, phone });
      this.setState({ status: "image" });
    } catch (error) {
      console.log(error);
    }
  };

  handleImages = async () => {
    const { img_one, img_two, img_three } = this.state;
    if (!img_one || !img_two || !img_three) {
      alert("Must upload all three images");
      return;
    }

    try {
      const images = [img_one, img_two, img_three];
      const profile_images = await uploadImages(images);
      await setUser(userId, { profile_images });
      this.setState({ status: "baverages" });
    } catch (error) {
      console.log(error);
    }
  };

  handleCheckboxes = (isSelected, status, value) => {
    const { meeting, baverages } = this.state;

    if (status === "meeting") {
      if (isSelected) {
        baverages.push(value);
        this.setState({ baverages });
      }
    } else {
      if (isSelected) {
        meeting.push(value);
        this.setState({ meeting });
      }
    }
  };

  handleBaverages = async () => {
    const { baverages, meeting } = this.state;
    const { history } = this.props;

    try {
      setUser(userId, { baverages, meeting });
      history.replace("/location");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { status } = this.state;
    return (
      <div className="main">
        {status === "basic" && (
          <div className=" basic">
            <label>
              <p>Nick Name :</p>
              <input
                className="basic-input"
                type="text"
                placeholder="Enter Your Nick Name"
                onChange={e => {
                  this.handleState("nickName", e.currentTarget.value);
                }}
              />
            </label>
            <label>
              <p>Mobile No :</p>
              <input
                className="basic-input"
                type="text"
                placeholder="Enter your Mobile Number"
                onChange={e => {
                  this.handleState("phone", e.currentTarget.value);
                }}
              />
            </label>

            <button className="btn" onClick={this.handleBasic}>
              Next
            </button>
          </div>
        )}

        {status === "image" && (
          <div className="image">
            <input
              type="file"
              onChange={e => {
                this.handleState("img_one", e.currentTarget.files[0]);
              }}
            />
            <input
              type="file"
              onChange={e => {
                this.handleState("img_two", e.currentTarget.files[0]);
              }}
            />
            <input
              type="file"
              onChange={e => {
                this.handleState("img_three", e.currentTarget.files[0]);
              }}
            />

            <button onClick={this.handleImages}>Next</button>
          </div>
        )}

        {status === "baverages" && (
          <div className="BM">
            <div className="baverages">
              <h1>Baverages</h1>
              <label>
                <input
                  type="checkbox"
                  value="cofee"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "beverages",
                      e.currentTarget.value
                    )
                  }
                />
                Cofee
              </label>
              <label>
                <input
                  type="checkbox"
                  value="tea"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "beverages",
                      e.currentTarget.value
                    )
                  }
                />
                Tea
              </label>
              <label>
                <input
                  type="checkbox"
                  value="juice"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "beverages",
                      e.currentTarget.value
                    )
                  }
                />
                Juice
              </label>
            </div>
            <div className="meeting">
              <h1>Meetings</h1>
              <label>
                <input
                  type="checkbox"
                  value="30 mins"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "meeting",
                      e.currentTarget.value
                    )
                  }
                />
                30 Mins
              </label>
              <label>
                <input
                  type="checkbox"
                  value="60 mins"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "meeting",
                      e.currentTarget.value
                    )
                  }
                />
                60 Mins
              </label>
              <label>
                <input
                  type="checkbox"
                  value="120 mins"
                  onChange={e =>
                    this.handleCheckboxes(
                      e.currentTarget.checked,
                      "meeting",
                      e.currentTarget.value
                    )
                  }
                />
                120 Mins
              </label>
              <button onClick={this.handleBaverages}>Next</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
