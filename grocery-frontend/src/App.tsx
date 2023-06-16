import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ListPage from './pages/ListPage';
import Login from './pages/Login';
import Register from './pages/Register';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <IonReactRouter>
      <Route path="/home">
        {isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Redirect to="/login" />}
      </Route>
      <Route path="/list/:id">
        {isAuthenticated ? <ListPage /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
      </Route>
      <Route path="/register">
        {isAuthenticated ? <Redirect to="/home" /> : <Register />}
      </Route>
      <Redirect from="/" to="/login" exact />
    </IonReactRouter>
  );
};

export default App;
