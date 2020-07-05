import React, { useReducer } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './LoginPage.css';
import { useChechAuthed } from '../hooks/useCheckAuthed';
const initState = {
  username: "",
  password: '',
  showToast: false,
  message: '',
  showLoading: false,
}

function reducer(state:any, action:any){
  return {
    ...state,
    ...action,
  }
}

const LoginPage = (props:any) => {
  const { history, GlobalDispatch } = props;
  const [state, dispatch ] = useReducer(reducer, initState);
  const {username, password } = state;
  const redirectToUrl = (url: string) => {
    history.push(url)
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    dispatch({
      showLoading: true,
    });
    localStorage.setItem('token', '123');
    GlobalDispatch({
      authed: true,
    })
    redirectToUrl('/');

  }

  const changeIput = (fieldName:string, value:string) => {
    
    const field:any = {};
    field[fieldName] = value;
    dispatch({
      ...field,
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>登录</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel  position="stacked">用户名 <IonText color='danger'>*</IonText> </IonLabel>
            <IonInput onIonChange={(e:any) => changeIput('username', e.detail.value)} 
            value={username} required placeholder='' />
          </IonItem>
          <IonItem>
          <IonLabel   position="stacked">密码 <IonText color='danger'>*</IonText> </IonLabel>
            <IonInput required
             onIonChange={(e:any) => changeIput('password', e.detail.value)} 
             value={password} placeholder='' type="password" />
          </IonItem>
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}>
          <IonButton  type='submit'>登录</IonButton>
          <IonButton onClick={(e:any) => redirectToUrl('/register')}>注册</IonButton>
          </section>
          </form>
       
        
        </IonCard>
     
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
