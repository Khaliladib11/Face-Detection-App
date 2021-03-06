import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: 'API KEY'
 });

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
    }
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - ( clarifaiFace.right_col * width ),
      buttonRow: height - ( clarifaiFace.bottom_row * height )
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then( response => this.displayFaceBox( this.calculateFaceLocation(response) ) )
    .catch(err => console.log(err) );
  }

  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState({isSignedIn: false});
    }else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState( { route: route } );
  }

  render(){
    const { imageUrl, box, route, isSignedIn } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation onRouteChange={ this.onRouteChange } isSignedIn={ isSignedIn } />
        {
          route === 'home'
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm 
                  onRouteChange={this.onRouteChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition 
                  imageUrl={imageUrl}
                  box={box}
                />
              </div>
            : (
              route === 'signIn' 
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
