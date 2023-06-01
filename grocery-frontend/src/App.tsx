import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => (
  <IonReactRouter>
    <Route path="/home" component={Home} exact />
    <Route path="/login" component={Login} exact />
    <Route path="/register" component={Register} exact />
    <Redirect from="/" to="/login" exact />
  </IonReactRouter>
);

export default App;
