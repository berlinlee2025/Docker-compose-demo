import React, { useState, useEffect, useCallback, useContext } from 'react';
import './App.scss';

// Top Navigation panel
import Navigation from './components/Navigation/Navigation';

// Routes
import Home from './routes/Home/Home';
import Signin from './routes/Signin/Signin';
import Register from './routes/Register/container/Register';

// User Records
import CheckRecordsPanel from './components/CheckRecords/CheckRecordsPanel';
import ColorRecords from './routes/Records/ColorRecords/ColorRecords';
import CelebrityRecords from './routes/Records/CelebrityRecords/CelebrityRecords';
import AgeRecords from './routes/Records/AgeRecords/AgeRecords';

// Utility helper functions
// import loadUserFromLocalStorage from './util/loadUserFromLocalStorage';
import findCelebrity from './util/ai-detection/findCelebrity';
import findColor from './util/ai-detection/findColor';
import findAge from './util/ai-detection/findAge';
import calculateFaceLocation from './util/ai-detection/calculateFaceLocation';
import { returnDateTime } from './util/returnDateTime';
import axios from 'axios';

// Context API
import { UserContext } from './shared/context/user-context';
import { RecordContext } from './shared/context/record-context';
import { AIContext } from './shared/context/ai-context';

/* document.cookie 'connect.sid' only becomes available after a user has successfully signed in */
// const documentCookie = document.cookie;

const App = () => {

  const [state, setState] = useState({
    input: '', // this.state.input => Users' input imageUrl => Can be used for onClick events
      imageUrl: '', // this.state.imageUrl should NOT be used for onClick => React circular references
      box: {},
      celebrity: {},
      celebrityName: '',
      colors: [],
      dimensions: { width: window.innerWidth }, // Initialize dimensions state
      age: [],
      face_hidden: true,
      color_hidden: true,
      age_hidden: true,
      responseStatusCode: Number(''),

      /** if user is signed in => retrieve his/her lastRoute
      otherwise => route to 'signin' page **/
      // route: localStorage.getItem('userData') ? 'home' : 'signin',
      route: localStorage.getItem('userData') ? localStorage.getItem('lastRoute') : 'signin',

      // user: {},
      user: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : {},
      isSignedIn: false,

      // userCelebrityRecords: [],
      // userColorRecords: [],
      // userAgeRecords: [],
      userCelebrityRecords: localStorage.getItem('celebrityRecords') ? localStorage.getItem('celebrityRecords') : [],
      userColorRecords: localStorage.getItem('colorRecords') ? localStorage.getItem('colorRecords') : [],
      userAgeRecords: localStorage.getItem('ageRecords') ? localStorage.getItem('ageRecords') : []
  });

  const [ token, setToken ] = useState(state.user.token);

  useEffect(() => {
    localStorage.setItem('lastRoute', 'home');
  }, []);

  /** Clear userData including JWT token every 60 minutes */
  useEffect(() => {
    const intervalId = setInterval(() => {
      localStorage.removeItem('userData');
      console.log('userData removed'); // Added for debugging
  
      setState(prevState => ({
        ...prevState,
        route: 'signin',
        user: {},
        isSignedIn: false,
      }));
    }, 60 * 60 * 1000);
  
    return () => clearInterval(intervalId); // Cleanup function
  }, []);

  /* Listen to changes in state.isSignedIn for any updates needing re-mount */
  useEffect(() => {
    const handleResize = () => {
      setState(prevState => ({ ...prevState, dimensions: { width: window.innerWidth } }));
    };
    
    window.addEventListener('resize', handleResize);  

    const validateUsers = setInterval(() => {
      if (!state.user.id) {
        setState(prevState => ({
          ...prevState,
          route: 'signin',
          user: {}
        }))
      }
    }, 900000); // Resetting User in every 15 mins
    
    const interval = setInterval(() => {
      setState(prevState => ({ ...prevState, dimensions: { width: window.innerWidth } }));
    }, 120000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      clearInterval(validateUsers);
    };
  }, [state.isSignedIn, state.user.id]);

  /* if user is signed in => state.isSignedIn = true
  Mount 'lastRoute' to localStorage
  Listen on changes in 'state.route', 'state.isSignedIn' */
  useEffect(() => {
    if (state.isSignedIn) {
      localStorage.setItem('lastRoute', state.route);
    }
  }, [state.route, state.isSignedIn]);

  /* Listening to changes to any of below => console log them */
  useEffect(() => {

    console.log('\nstate.input: \n', state.input, `\n`);
    console.log('\nstate.face_hidden', state.face_hidden, `\n`);
    console.log('\nstate.color_hidden', state.color_hidden, `\n`);
    console.log('\nstate.age_hidden', state.age_hidden, `\n`);
    console.log('\nstate.responseStatusCode:\n', state.responseStatusCode, `\n`);
    console.log(`\nstate.route:\n`, state.route, `\n`);
    console.log(`\nstate.user:\n`, state.user, `\n`);
    console.log(`\nstate.isSignedIn:\n`, state.isSignedIn, `\n`);
    
  }, [state.input, state.face_hidden, state.color_hidden, state.age_hidden, state.responseStatusCode, state.route, state.user, state.isSignedIn]);

  
  /** START <UserContext /> **/
  // ** src/shared/context/user-context.js
  // useCallback means when this saveUser callback is invoked, it never gets recreated
  const saveUser = useCallback((user) => {
    setState(prevState => ({
      ...prevState,
      user: user
    })
    );
    console.log(`\nsrc/App.js saveUser() - state.user:\n`, state.user, `\n`);
  }, [state.user]);

  // ** src/shared/context/user-context.js
  const resetUser = useCallback(() => {
    setState(prevState => ({ 
      ...prevState,
      user: {}, 
      isSignedIn: false, 
      token: false,
      route: 'signin' 
    })
    );
  }, []);

  // ** src/shared/context/user-context.js
  const onRouteChange = useCallback((routeInput) => {
    const callbackName = `onRouteChange`;

    switch (routeInput) {
        case 'signout':
          setState(prevState => ({ 
            ...prevState,
            token: false,
            route: 'signin',
            isSignedIn: routeInput !== 'signin'
          })
          );
          console.log(`\n${callbackName}(signout)\n`);
          break;
        
        // else if onClick={() => onRouteChange('home')}
        case 'home':
        case 'ageRecords':
        case 'colorRecords':
        case 'celebrityRecords':
          setState(prevState => ({
            ...prevState,
            route: routeInput,
            isSignedIn: true,
          })
          );
          return;
        
        // No matter what, still wanna change the route
        default:
          setState(prevState => ({ 
            ...prevState, 
            route: routeInput,
          })
        );
          return;
    }
  }, []);

  // For Celebrity detection model
  const displayCelebrity = (celebrity) => {
    setState(prevState => ({
      ...prevState,
      celebrity: celebrity
    })
    );
  };

  // For Color detection model
  const displayColor = (colorInput) => {
    setState(prevState => ({ 
      ...prevState,
      colors: colorInput 
    })
    );
  };

  // For Age detection model
  const displayAge = (ageInput) => {
    setState(prevState => ({ 
      ...prevState,
      age: ageInput 
    })
    );
  };

  const displayFaceBox = (box) => {
    setState(prevState => ({ 
      ...prevState,
      box: box 
    })
    );
  };

  // reset all User's color & celebrity & age detection records in Frontend
  const resetUserRecords = () => {
    setState(prevState => ({
      ...prevState,
      userColorRecords: [],
      userCelebrityRecords: [],
      userAgeRecords: []
    }));

    localStorage.removeItem('celebrityRecords');
    localStorage.removeItem('colorRecords');
    localStorage.removeItem('ageRecords');
  }

  /** START <RecordContext /> **/
  // Everytime any of Detection Models is clicked
  // reset all state variables to allow proper rendering of DOM elements
  const resetState = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      box: {},
      celebrity: {},
      celebrityName: '',
      colors: [],
      age: [],
      face_hidden: true,
      color_hidden: true,
      age_hidden: true,
      responseStatusCode: Number(''),
    })
    );
  }, []);

  // To be passed to <CheckRecordsPanel /> in src/components/CheckRecords/CheckRecrodsPanel.jsx
  const onHomeButton = useCallback(() => {
    // Reset all state variables to allow proper rendering from Detection Models
    resetState();

    // Reset User's all color & celebrity & age records in Frontend
    resetUserRecords();

    // Change Route to 'home' => Checkout App.js onRouteChange()
    onRouteChange('home');

    setState(prevState => ({ 
      ...prevState,
      route: 'home' 
    })
    );
  }, [onRouteChange, resetState])

  // Retrieve User's Color Records from Node.js => PostgreSQL
  const onCelebrityRecordsButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering of side-effects
    resetState();
    resetUserRecords();

    setState(prevState => ({ 
      ...prevState,
      route: 'celebrityRecords' 
      })
    );

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    onRouteChange('celebrityRecords');

    const devFetchGetUserCelebrityUrl = 'http://localhost:3001/records/get-user-celebrity';
    const prodFetchGetUserCelebrityUrl = 'https://www.ai-recognition-backend.com/records/get-user-celebrity';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserCelebrityUrl : devFetchGetUserCelebrityUrl;

    const bodyData = JSON.stringify({
      userId: state.user.id
    });

    console.log(`\nonCelebrityRecordsButton is fetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.token}`
      },
      body: JSON.stringify({
        userId: state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Celebrity Records response:\n`, response, `\n`);
      console.log(`\nFetched User's Celebrity Records\nresponse.celebrityData`, response.celebrityData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // updateEntries();
        setState(prevState => ({
          ...prevState,
          userCelebrityRecords: response.celebrityData
        }))

        localStorage.setItem('celebrityRecords', JSON.stringify(response.celebrityData));
        localStorage.setItem('lastRoute', 'home');
      };
    })
    .catch((err) => {
      console.log(`\nError fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js this.state.userCelebrityRecords:\n`, state.userCelebrityRecords, `\n`);
  }, [onRouteChange, resetState, state.user.id, state.userCelebrityRecords, state.user.token]);

  // Retrieve User's Color Records from Node.js => PostgreSQL
  const onColorRecordsButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering of side-effects
    resetState();
    resetUserRecords();

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    onRouteChange('colorRecords');

    const devFetchGetUserColorUrl = 'http://localhost:3001/records/get-user-color';
    const prodFetchGetUserColorUrl = 'https://www.ai-recognition-backend.com/records/get-user-color';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserColorUrl : devFetchGetUserColorUrl;

    const bodyData = JSON.stringify({
      userId: state.user.id
    });

    console.log(`\nFetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.token}`
      },
      body: JSON.stringify({
        userId: state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Colors Records obj:\n`, response, `\n`);
      console.log(`\nFetched User's Colors Records obj:\n`, response.colorData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // updateEntries();
        setState(prevState => ({
          ...prevState,
          userColorRecords: response.colorData
        }))

        localStorage.setItem('colorRecords', JSON.stringify(response.colorData));
        localStorage.setItem('lastRoute', 'home');
      };
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js state.userColorRecords:\n`, state.userColorRecords, `\n`);
  }, [onRouteChange, resetState, state.user.id, state.userColorRecords, state.user.token]);

  // Retrieve User's Color Records from Node.js => PostgreSQL
  const onAgeRecordsButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering of side-effects
    resetState();
    resetUserRecords();

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    onRouteChange('ageRecords');

    const devFetchGetUserColorUrl = 'http://localhost:3001/records/get-user-age';
    const prodFetchGetUserColorUrl = 'https://www.ai-recognition-backend.com/records/get-user-age';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserColorUrl : devFetchGetUserColorUrl;

    const bodyData = JSON.stringify({
      userId: state.user.id
    });

    console.log(`\nFetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.token}`
      },
      body: JSON.stringify({
        userId: state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Age Records response:\n`, response, `\n`);
      console.log(`\nFetched User's Age Records response.ageData:\n`, response.ageData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // updateEntries();
        setState(prevState => ({
          ...prevState,
          userAgeRecords: response.ageData
        }))

        localStorage.setItem('ageRecords', JSON.stringify(response.ageData));
        localStorage.setItem('lastRoute', 'home');
      };
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js state.userAgeRecords:\n`, state.userAgeRecords, `\n`);
  }, [onRouteChange, resetState, state.user.id, state.userAgeRecords, state.user.token]);
  /** END <RecordContext /> **/

  /** START <AIContext /> **/
  // ClarifaiAPI Celebrity Face Detection model
  const onCelebrityButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    resetState();

    // Whenever clicking Detect button => setState
    setState(prevState => ({
        ...prevState,
        // setState imageUrl: state.input from InputChange as event onChange
        // Thus state.imageUrl = a React Event => NOT be used as props involving circular references
        imageUrl: state.input,
        face_hidden: false
      })
    );

    /* From Clarifai API documentation, this API can be consumed as below: */

    /* Celebrity Recognition - Fetching local web server for celebrityimage */
    const devFetchCelebrityImageUrl = 'http://localhost:3001/celebrity-image';
    const prodFetchCelebrityImageUrl = 'https://www.ai-recognition-backend.com/celebrity-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchCelebrityImageUrl : devFetchCelebrityImageUrl;

    // const userData = JSON.parse(localStorage.getItem('userData'));
    console.log(`\nonCelebrityButton():\nstate.user.id: `, state.user.id, `\n`)
    console.log(`\nonCelebrityButton():\nstate.user.token: `, state.user.token, `\n`)

      fetch(fetchUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`
        },
        body: JSON.stringify({ // sending stringified state variables as JSON objects
          input: state.input,
          userId: state.user.id
        })
      })
      .then(response => response.json())
      .then(response => {
        console.log('HTTP Response: \n', response);
        console.log('HTTP request status code:\n', response.status.code);
        console.log(
          'bounding box',
          response.outputs[0].data.regions[0].region_info.bounding_box
        );
        console.log(
          'Celebrity obj:\n',
          response.outputs[0].data.regions[0].data.concepts[0]
        );

        if (response) { 
          // updateEntries();
        };

        displayFaceBox(calculateFaceLocation(response));
        // displayCelebrity(findCelebrity(response));
        displayCelebrity(findCelebrity(response));
        setState(prevState => ({ 
          ...prevState,
          responseStatusCode: response.status.code 
        })
        )
      })
      .catch(err => {
        console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
      });
  }, [resetState, state.input, state.user.id, state.user.token]);

  // ClarifaiAPI Color Detection model
  const onColorButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    resetState(); 

    // Whenever clicking Detect button
    setState(prevState => ({
        ...prevState,
        // setState imageUrl: state.input from InputChange
        imageUrl: state.input,
        // setState color_hidden: false to allow rendering of <ColorRecognition />
        // then passing color_props to <ColorRecognition />
        color_hidden: false
      })
    );

    /* Color Recognition - Fetching local Web Server vs live Web Server on Render */
    const devFetchColorImageUrl = 'http://localhost:3001/color-image';
    const prodFetchColorImageUrl = 'https://www.ai-recognition-backend.com/color-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchColorImageUrl : devFetchColorImageUrl;

    fetch(fetchUrl, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.token}`
      },
      body: JSON.stringify({ // sending stringified state variables as JSON objects
        input: state.input,
        userId: state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log('Fetched Colors obj:\n', response.outputs[0].data);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // updateEntries();
      };

      displayColor(findColor(response));
    })
    .catch(err => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
    });
  }, [resetState, state.input, state.user.id, state.user.token]);

  // ClarifaiAPI Age Detection model
  const onAgeButton = useCallback(async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    resetState();

    // Whenever clicking 'Detect Age' button
    setState(prevState => ({
        ...prevState,
        // setState imageUrl: state.input from InputChange
        imageUrl: state.input,
        // setState({age_hidden: false}) to allow rendering of <AgeRecognition />
        age_hidden: false
      })
    );

    /* Age Recognition - Fetching local dev server vs live Web Server on Render */
    const devFetchAgeUrl = 'http://localhost:3001/age-image';
    const prodFetchAgeUrl = 'https://www.ai-recognition-backend.com/age-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchAgeUrl : devFetchAgeUrl;

    fetch(fetchUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`
        },
        body: JSON.stringify({ // sending stringified state variables as JSON objects
          input: state.input,
          userId: state.user.id
        })
    })
    .then(response => response.json())
    .then(response => {
      console.log('\nHTTP Response\nAge Detection', response);
      console.log('\nHTTP request status code:\n', response.status.code);
      console.log(
        'Fetched Age grp obj:\n',
        response.outputs[0].data.concepts
    );

    // color-detection
    // displayColor adding color hex to state.color
    // findColor(response) returns color hex
    if (response) { 
      // updateEntries();
      };
      displayAge(findAge(response));
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
    });
  }, [resetState, state.input, state.user.id, state.user.token]);

  // For <ImageLinkForm />
  const onInputChange = useCallback((event) => {
    setState(prevState => ({
      ...prevState, 
      input: event.target.value 
    })
    );
  }, []);
  /** END <AIContext /> */

  // src/components/Navigation/Navigation.jsx
  const onSignout = useCallback(async () => {
    resetState();

    setState(prevState => ({
      ...prevState,
      celebrity: {},
      colors: [],
      age: [],
      user: {},
      isSignedIn: false,
      route: 'signin'
    })
    );

    localStorage.removeItem('lastRoute');
    localStorage.removeItem('userData');
    resetUserRecords();
    onRouteChange('signin')

  }, [onRouteChange, resetState]);


  const saveToDevice = async (outerHTML) => {
    const devSaveHtmlUrl = 'http://localhost:3001/save-html';
    const prodSaveHtmlUrl = 'https://www.ai-recognition-backend.com/save-html';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodSaveHtmlUrl : devSaveHtmlUrl;
    const date = new Date().toISOString().replace(/:/g, '-');  // Format date for filename

    try {
        const response = await axios({
            method: 'POST',
            url: fetchUrl,
            data: { 
              htmlContent: outerHTML 
            },
            responseType: 'arraybuffer',
            headers: {
                Authorization: `Bearer ${state.user.token}`
            }
        });

        console.log(`\nsaveToDevice response.data: `, response.data, `\n`);

        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', `color-details_${date}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Failed to save colorHtml to device:", error);
    }
  };

  /* Rendering all components */
  // destructuring props from state
  const {
    age,
    face_hidden,
    color_hidden,
    age_hidden,
    box,
    colors,
    celebrity,
    dimensions,
    imageUrl,
    input,
    responseStatusCode,
    user,
    userAgeRecords,
    userCelebrityRecords,
    userColorRecords,
    route,
    isSignedIn
  } = state;

    const colors_array = colors && colors.length > 0 ? colors.map(color => color) : [];
    const age_props = age && age.length > 0 ? age.map((each, i) => each.age.name)[0] : [];

    const dateTime = returnDateTime();
    console.log('\ndateTime:\n', dateTime, `\n`);
    console.log(`\nstate.user: `, state.user, `\n`);
    console.log(`\nstate.route: `, state.route, `\n`);
    console.log(`\nstate.user.id: `, state.user.id, `\n`);
    
    const renderRoute = (component) => {
      return user ? 
      component 
      : 
      <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange,
            // fetchUserData: fetchUserData,
            resetState: resetState,
            onSignout: onSignout
          }}
      >
        <Signin />
      </UserContext.Provider>;
    }

    // Enhance React Scalability for allowing to add more React routes without React Router DOM
    const routeComponents = {
      'home': renderRoute(
        <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange
          }}
        >
          <RecordContext.Provider 
          value={{ 
            onHomeButton: onHomeButton,
            onCelebrityRecordsButton: onCelebrityRecordsButton,
            userCelebrityRecords: userCelebrityRecords,
            onColorRecordsButton: onColorRecordsButton,
            userColorRecords: userColorRecords,
            onAgeRecordsButton: onAgeRecordsButton,
            userAgeRecords: userAgeRecords,
            resetState: resetState
          }}
          >
            <AIContext.Provider
            value={{
              name: user?.name,
              entries: user?.entries,
              input: input,
              imageUrl: imageUrl,
              celebrityName: celebrity?.name,
              face_hidden: face_hidden,

              color_props: colors_array,
              color_hidden: color_hidden,
              age: age_props,
              age_hidden: age_hidden,
              box: box,

              saveToDevice: saveToDevice,
              onInputChange: onInputChange,

              // AI Recognition buttons
              onCelebrityButton: onCelebrityButton,
              onColorButton: onColorButton,
              onAgeButton: onAgeButton
            }}>
              <Home />
            </AIContext.Provider>            
          </RecordContext.Provider>
        </UserContext.Provider>
      ),
      'signin': renderRoute(
        <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange
          }}
        >
          <Signin />
        </UserContext.Provider>
      ),
      'register': renderRoute(
        <UserContext.Provider 
        value={{ 
          user: user,
          isSignedIn: isSignedIn,
          token: token,
          setToken: setToken,
          saveUser: saveUser,
          resetUser: resetUser,
          onRouteChange: onRouteChange
        }}
        >
          <Register />
        </UserContext.Provider>
      ),
      'ageRecords': renderRoute(
        <React.Fragment>
          <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange
          }}
          >
            <RecordContext.Provider 
            value={{ 
              onHomeButton: onHomeButton,
              onCelebrityRecordsButton: onCelebrityRecordsButton,
              userCelebrityRecords: userCelebrityRecords,
              onColorRecordsButton: onColorRecordsButton,
              userColorRecords: userColorRecords,
              onAgeRecordsButton: onAgeRecordsButton,
              userAgeRecords: userAgeRecords,
              resetState: resetState
            }}
            >
              <CheckRecordsPanel dimensions={dimensions} />
              <AgeRecords dimensions={dimensions} />
            </RecordContext.Provider>
          </UserContext.Provider>
        </React.Fragment>
      ),
      'colorRecords': renderRoute(
        <React.Fragment>
          <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange,
            // fetchUserData: fetchUserData
          }}
          >
            <RecordContext.Provider 
            value={{ 
              onHomeButton: onHomeButton,
              onCelebrityRecordsButton: onCelebrityRecordsButton,
              userCelebrityRecords: userCelebrityRecords,
              onColorRecordsButton: onColorRecordsButton,
              userColorRecords: userColorRecords,
              onAgeRecordsButton: onAgeRecordsButton,
              userAgeRecords: userAgeRecords,
              resetState: resetState
            }}
            >
              <CheckRecordsPanel dimensions={dimensions} />
              <ColorRecords dimensions={dimensions} />
            </RecordContext.Provider>
          </UserContext.Provider>
        </React.Fragment>
      ),
      'celebrityRecords': renderRoute(
        <React.Fragment>
          <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            token: token,
            setToken: setToken,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange,
            // fetchUserData: fetchUserData
          }}
          >
            <RecordContext.Provider 
            value={{ 
              onHomeButton: onHomeButton,
              onCelebrityRecordsButton: onCelebrityRecordsButton,
              userCelebrityRecords: userCelebrityRecords,
              onColorRecordsButton: onColorRecordsButton,
              userColorRecords: userColorRecords,
              onAgeRecordsButton: onAgeRecordsButton,
              userAgeRecords: userAgeRecords,
              resetState: resetState
            }}
            >
              <CheckRecordsPanel 
              dimensions={dimensions}
              />
              <CelebrityRecords
                dimensions={dimensions}
              />
            </RecordContext.Provider>
          </UserContext.Provider>
        </React.Fragment>
      )
    }

    return (
      <div className="App star">
        {/* Conditional rendering */}
        <UserContext.Provider 
          value={{ 
            user: user,
            isSignedIn: isSignedIn,
            saveUser: saveUser,
            resetUser: resetUser,
            onRouteChange: onRouteChange,
            // fetchUserData: fetchUserData,
            resetState: resetState,
            onSignout: onSignout
          }}
        >
          <Navigation />
        </UserContext.Provider>

        {routeComponents[route] ?? <div>Page not found</div>}
      </div>
    );
};

export default App;
