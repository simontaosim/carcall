import React, { useReducer } from 'react';
import { IonContent,IonToast, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonItem, IonInput, IonText, IonLabel, IonLoading } from '@ionic/react';
import './RegisterPage.css';
import { useHistory } from 'react-router-dom';

//所有正则
const REQEXP_USERNAME_PATTERN = /^[a-zA-Z0-9_-]{5,21}$/;
//用户名５到21位（字母，数字，下划线，减号）
const REQEXP_REGISTER_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
//密码6个字符，至少一个字母和一个数字

const initState = {
  username: "",
  password: '',
  passwordRepeat: '',
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

const RegisterPage: React.FC = (props:any) => {
  const {history, GlobalDispatch} = props;
  const [state, dispatch ] = useReducer(reducer, initState)
  const {username, password, passwordRepeat, showToast, message, showLoading} = state;

  const redirectToUrl = (url: string) => {
    history.push(url)
  }

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if(!REQEXP_USERNAME_PATTERN.test(username)){
      dispatch({
        message: '用户名５到21位(字母,数字,下划线,减号)',
        showToast: true,
      })
      return false;
    }
    if(!REQEXP_REGISTER_PASSWORD.test(password)){
      dispatch({
        message: '密码6-18位,至少一个字母和一个数字',
        showToast: true,
      })
      return false;
    }
    if(passwordRepeat !== password){
      dispatch({
        message: '两次密码输入不一致',
        showToast: true,
      })
      return false;
    }
    dispatch({
      showLoading: true,
    });
    localStorage.setItem('token', '123');
    GlobalDispatch({
      authed: true,
    })
    history.push('/')

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
          <IonTitle>注册</IonTitle>
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
            value={username} required placeholder='５到21位(字母,数字,下划线,减号)' />
          </IonItem>
          <IonItem>
          <IonLabel   position="stacked">密码 <IonText color='danger'>*</IonText> </IonLabel>
            <IonInput required
             onIonChange={(e:any) => changeIput('password', e.detail.value)} 
             value={password} placeholder='6-18位,至少一个字母和一个数字' type="password" />
          </IonItem>
          <IonItem>
          <IonLabel  position="stacked">重复密码 <IonText color='danger'>*</IonText> </IonLabel>
            <IonInput required
             onIonChange={(e:any) => changeIput('passwordRepeat', e.detail.value)} 
             value={passwordRepeat} placeholder='' type="password" />
          </IonItem>
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}>
            <IonButton type='submit'>注册</IonButton>
            <IonButton onClick={(e: any) => redirectToUrl('/login')}>登录</IonButton>

          </section>
          </form>


        </IonCard>

      </IonContent>
      <IonToast isOpen={showToast}
        onDidDismiss={() => dispatch({
          showToast: false,
        })}
        color="warning"
        message={message} position="top"
        duration={2000} />
    <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => dispatch({showLoading: false})}
        message={'请稍后'}
        duration={5000}
      />
    </IonPage>
  );
};

export default RegisterPage;
