import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

//Firebase Methods
import { setUser } from "../../config/firebase";

//import styles
import "./style.css";

//Local Storage
const userId = localStorage.getItem("userId");

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: {}
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({ coords: { latitude, longitude } });
    });
  };

  updateLocation = coords => {
    const { lat, lng } = coords.latLng;
    let location = {
      latitude: lat(),
      longitude: lng()
    };
    this.setState({
      coords: location
    });
  };

  handleSubmit = async () => {
    const { coords } = this.state;
    const { history } = this.props;
    try {
      if ((coords && !coords.latitude) || !coords.longitude) {
        alert("Select proper location!");
        return;
      }

      await setUser(userId, { coords, registerd: true });
      history.replace("/home");
    } catch (error) {
      console.log("TCL: Location -> _handleSubmit -> error", error);
    }
  };

  render() {
    const { coords } = this.state;
    return (
      <div className="container">
        <MyMapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={<div style={{ height: "500px" }} />}
          mapElement={<div style={{ height: "100%" }} />}
          coords={coords}
          updateLocation={this.updateLocation}
        />
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

//Map component
const MyMapComponent = withScriptjs(
  withGoogleMap(props => {
    const { coords, updateLocation, isMarkerShown } = props;
    return (
      <GoogleMap
        center={{ lat: coords.latitude, lng: coords.longitude }}
        defaultZoom={20}
      >
        {isMarkerShown && (
          <Marker
            draggable={true}
            position={{ lat: coords.latitude, lng: coords.longitude }}
            onDragEnd={position => {
              updateLocation(position);
            }}
          />
        )}
      </GoogleMap>
    );
  })
);

export default Location;
