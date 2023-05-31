
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import Home from './pages/Home';

const App: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/home" component={Home} />
      <Redirect exact from="/" to="/home" />
    </IonRouterOutlet>
  </IonReactRouter>
);

export default App;

