import React, { useEffect, useState, useReducer } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { car, reader, person } from 'ionicons/icons';
import UseCarPage from './pages/UseCarPage';
import RegisterPage from './pages/RegisterPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LoginPage from './pages/LoginPage';
import { useChechAuthed } from './hooks/useCheckAuthed';


const initState  =  {
  authed: false,
}

function reducer(state:any, action:any){
  return {
    ...state,
    ...action
  }
}


const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const LoginPageWithAppDispatch = (props:any) => {
    return <LoginPage GlobalDispatch={dispatch}  {...props}/>
  }
  const RegisterPageWithAppDispatch = (props:any) => {
    return <RegisterPage GlobalDispatch={dispatch}  {...props}/>
  }
  const { authed } = state;

  useEffect(()=>{
    if(window.localStorage.getItem('token')){
      dispatch({
        authed: true,
      })
    }else{
      dispatch({
        authed: false,
      })
    }
  },[])

  return (
    <IonApp>
      <IonReactRouter>
      {
            authed ? <IonTabs>
            <IonRouterOutlet >
              <Route path="/use_car" component={UseCarPage} exact={true}  />
              <Route path="/" render={() => <Redirect to="/use_car" />} exact={true} />
              <Route path="/*" render={() => <Redirect to="/use_car" />} exact={true} />
            </IonRouterOutlet>
          
            <IonTabBar slot="bottom">
              <IonTabButton tab="use_car" href="/use_car">
                <IonIcon icon={car} />
                <IonLabel>用车</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon icon={reader} />
                <IonLabel>订单</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon icon={person} />
                <IonLabel>我</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
          :
          <>
              <Route path="/login" component={LoginPageWithAppDispatch} exact={true} />
              <Route path="/register" component={RegisterPageWithAppDispatch}  exact={true}  />
              <Route path="/*" render={() => <Redirect to="/login" />} exact={true} />
              </>
          }
        
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
