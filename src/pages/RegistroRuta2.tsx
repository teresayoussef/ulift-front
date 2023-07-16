import { Component } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Box, Container, Stack, Button, TextField, Typography} from "@mui/material";
import SubPaginasHeader from "../components/SubPaginasHeader";
import { LoadingButton } from "@mui/lab";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import axios from "axios";
import { parse } from "path";
import { useSnackbar } from "notistack";


interface Values {
  email: string;
  nombreRuta: string;
  paradas: [];
}

const initialValues: Values = {
  email: "",
  nombreRuta: "",
  paradas: [],
};

const loader = new Loader({
  apiKey: "AIzaSyD7v8N1XTXpHinGn0ka8CO0l61UWh1fesA",
  version: "weekly",
  libraries: ["places", "drawing"],
});

const rendererOptions: object = {
  suppressMarkers: true,
};

const ucab: object = { lat: 8.296677954778339, lng: -62.71350327511522 };


export default class RutaUsuario2 extends Component<
  {},
  {
    google: any;
    map: any;
    markers: Array<{ lat: number; lng: number }>;
    finalMarker: any;
    path: any;
    name: string;
  }
> {
  googleMapDiv!: HTMLElement | any;
  directionsService!: any;
  directionsRenderer!: any;
  currentLocation!: any;

  constructor(props: any) {
    super(props);
    this.state = {
      google: null,
      map: null,
      markers: [],
      finalMarker: null,
      path: "",
      name: "",
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this);
  }

  

  componentDidMount() {
    let self = this;
    // var lat = parseFloat(localStorage.getItem("coordenadas")!.split(",")[0]);
    // const lng = parseFloat(localStorage.getItem("coordenadas")!.split(",")[1]);
    var lat =  8.292362164394163;
    var lng = -62.742359070043264;
    const defaultMapOptions = {
      center: {
        lat: lat,
        lng: lng,
      },
      zoom: 17,
      clickableIcons: false,
    };
    loader.load().then((google) => {
      const map = new google.maps.Map(self.googleMapDiv, defaultMapOptions);
      const currentMark = new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng,
        },
        map: map,
      });

      const ucab = { lat: 8.296814168450002, lng: -62.71148732766616 };

      const destinationMarker = new google.maps.Marker({
        position: ucab,
        map: map,
        icon : {
          url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
        }
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);

      this.setState({
        google: google,
        map: map,
        markers: [],
        finalMarker: null,
      });

      //add a marker to the map using on click event
      google.maps.event.addListener(map, "click", function (e: any) {
        let latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        self.setState({
          markers: [...self.state.markers, latLng],
        });

        self.handleMapClick(e, latLng);
      });
    });
  }

  handleMapClick(e: any, latLng: any) {
    this.directionsRenderer.setMap(this.state.map);
    this.calculateAndDisplayRoute(latLng);
  }

  calculateAndDisplayRoute(latLng: any) {
    const waypts = [];

    const { markers } = this.state;

    markers.push(latLng);

    for (let i = 0; i < markers.length - 1; i++) {
      waypts.push({
        location: markers[i],
        stopover: true,
      });
    }

    const destiny: google.maps.LatLngLiteral = latLng;
    const inUcab = localStorage.getItem("inUcab");
    const currentLocation = {
      lat: parseFloat(localStorage.getItem("coordenadas")!.split(",")[0]),
      lng: parseFloat(localStorage.getItem("coordenadas")!.split(",")[1]),
    }    

    this.currentLocation = currentLocation;

    this.directionsService
      .route({
        origin: currentLocation,
        destination: destiny,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypts,
      })
      .then((response: any) => {
        if (this.state.finalMarker != null) {
          this.state.finalMarker.setMap(null);
        }

        this.setState({ path: JSON.stringify(response.routes[0].overview_path) });

        const latlng: google.maps.LatLngLiteral = this.state.markers[this.state.markers.length - 1];

        const mark = new google.maps.Marker({
          position: latlng,
          map: this.state.map,
        });

        this.setState({
          finalMarker: mark,
        });

        this.directionsRenderer.setDirections(response);

      })
      .catch((e: any) => console.log(e));
  }

  retroceder(e: any, directionsService: any, directionsRenderer: any, latLng: any) {
    if (this.state.markers.length === 1) {
      this.directionsService
        .route({
          origin: this.currentLocation,
          destination: this.currentLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response: any) => {
          this.directionsRenderer.setDirections(response);
          this.setState({ path: JSON.stringify("") });
        })
        this.state.markers.pop();
        this.state.finalMarker.setMap(null);
      }
      
      if (this.state.markers.length > 1) {
        console.log(this.currentLocation);
        this.directionsService
        .route({
          origin: this.currentLocation,
          destination: this.state.markers[this.state.markers.length - 2],
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response: any) => {
          this.directionsRenderer.setDirections(response);
          this.setState({ path: JSON.stringify(response.routes[0].overview_path) });
        })
        this.state.finalMarker.setMap(null);
        const newMarker = new google.maps.Marker({
          position: this.state.markers[this.state.markers.length - 2],
          map: this.state.map,
        });
        this.setState({
          finalMarker: newMarker,
        });
        this.state.markers.pop();
  }
}

  render() {
    return (
      <Box>
        <SubPaginasHeader pageName="Registro de Ruta" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              maxWidth: 450,
              mb: 3,
              mt: 6,
              position: "relative",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Marca la ruta hacia la UCAB ( <img src="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" width={10}/>) 
            </Typography>
            <TextField
              id="nombreRuta"
              label="Nombre de la ruta"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <Box
              ref={(ref) => {
                this.googleMapDiv = ref;
              }}
              sx={{ height: "400px", width: "100%", mb: 3, mt: 3 }}
            ></Box>
            <Button
              variant="contained"
              onClick={(e) =>  this.retroceder(e, this.state.google.maps.DirectionsService, this.state.google.maps.DirectionsRenderer, this.state.markers[this.state.markers.length - 1])}
              fullWidth
            > Retroceder</Button>
            <Box>
              <p> </p>
            </Box>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                if (this.state.name === "") {
                  alert("Debes colocar un nombre a la ruta");
                }else if (this.state.markers.length === 0) {
                  alert("Debes colocar al menos una parada");
                }else{
                  const ucab = { lat: 8.296814168450002, lng: -62.71148732766616 };
                  const { markers } = this.state;	
                  const lastMarker = markers[markers.length - 1];
                  const distanceFromUcab = google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(lastMarker.lat, lastMarker.lng),
                    new google.maps.LatLng(ucab.lat, ucab.lng)
                  );
                  const maxDistance = 150;
                  if (distanceFromUcab > maxDistance) {
                    alert ("La última parada debe estar a menos de 150 metros de la entrada de la UCAB");
                    return;
                  }
                  var email = localStorage.getItem("email");
                  var data = JSON.stringify({
                    email: email,
                    path: this.state.path,
                    name: this.state.name,
                  });
  
                  const token = localStorage.getItem("token");
  
                  var config = {
                    method: "post",
                    url: "https://u-lift.azurewebsites.net/api/URoute",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    data: data,
                  };
  
                  axios(config)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Ruta registrada con éxito, puedes registrar otra o ir a tu perfil.");
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                }
              }}
              fullWidth
            >
              Registrar ruta
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }
}
