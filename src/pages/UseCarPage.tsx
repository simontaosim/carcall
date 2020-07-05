import React, { useReducer } from 'react';
import {
  IonInput, IonCard, IonPage, IonItem,
  IonToolbar, IonButtons,
  IonLabel, IonModal, IonButton, IonSearchbar, IonIcon, IonList, IonContent, IonToast, IonText, IonLoading
} from '@ionic/react';
import './UseCarPage.css';
import CustAMap from '../components/CustAMap';
import { caretDown } from 'ionicons/icons';
import 'moment/locale/zh-cn';


const moment = require('moment');
moment.locale('zh-cn');
const minStartTime = moment().add(1, 'hours').format(moment.HTML5_FMT.DATETIME_LOCAL);

interface ILocation {
  P: number,
  Q: number,
  lat: number,
  lng: number,
}

interface IUseCarPageState {
  typingStart: boolean,
  typingEnd: boolean,
  isModalOpen: boolean,
  city: string,
  addressList: [],
  addressListLoading: boolean,
  startAddress: string,
  endAddress: string,
  startPosition: ILocation,
  endPosition: ILocation,
  startTime: string,
  ordering: boolean,
  orderFail: boolean,
  orderSuccess: boolean,
  orderFailReason: string,
  keywords: string,
  mapMode: 'position' | 'driving' | 'search',
  showToast: boolean,

}

const initState: IUseCarPageState = {
  typingStart: false,
  typingEnd: false,
  isModalOpen: false,
  city: "成都",
  addressList: [],
  addressListLoading: false,
  startAddress: '',
  endAddress: '',
  startPosition: {
    P: 30.659461999751418,
    Q: 104.0657350002229,
    lat: 30.659462,
    lng: 104.065735,
  },
  endPosition: {
    P: 30.659461999751418,
    Q: 104.0657350002229,
    lat: 30.659462,
    lng: 104.065735,
  },
  startTime: minStartTime,
  ordering: false,
  orderFail: false,
  orderSuccess: false,
  orderFailReason: "",
  keywords: '',
  mapMode: 'position',
  showToast: false,

}
function reducer(state: IUseCarPageState = initState, action: any) {
  return {
    ...state,
    ...action,
  }

}


const UseCarPage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState as any);
  const { mapMode, startTime,
    typingEnd, isModalOpen, showToast,ordering,
    startAddress, city, endAddress, keywords, endPosition, addressList, startPosition } = state;
  const showModal = (params: any) => {
    dispatch({
      ...params,
      startAddress, endAddress,
      keywords: '',
      addressList: [],
      isModalOpen: true,
      mapMode: 'search'
    });

  }

  const closeModal = (e: any) => {
    dispatch({
      isModalOpen: false,
      mapMode: 'position'
    })
  }

  const getCurrentAddress = (address: string) => {
    dispatch({ startAddress: address });

  }

  const changeSearch = (e: any) => {
    console.log(e.detail);
    dispatch({
      keywords: e.detail.value,
    })


  }

  const searchAddresses = (addresses: []) => {
    console.log(addresses);
    dispatch({
      addressList: addresses,
    })
  }

  const serachItemClick = (index: number) => {
    const adr =
      addressList[index].name.includes('公交站') ? addressList[index].name : (addressList[index].address + '-' + addressList[index].name);
    if (typingEnd) {
      dispatch({
        endAddress: adr,
        endPosition: addressList[index].location,
        isModalOpen: false,
      })
    } else {
      dispatch({
        startAddress: adr,
        startPosition: addressList[index].location,
        isModalOpen: false,

      })
    }

  }

  const getStartPosition = (position: any) => {
    dispatch({
      startPosition: position,
    })
  }

  const confirmOrder = (e: any) => {
    if (!endAddress) {
      dispatch({
        showToast: true,
      })
      return false;
    }
    setTimeout(() => {
      dispatch({ mapMode: 'driving' })
    })
  }

  const cancelOrder = (e: any) => {
    dispatch({
      mapMode: 'position'
    })
  }





  return (
    <IonPage>

      <CustAMap
        mode={mapMode}
        city={city}
        keywords={keywords}
        endPosition={endPosition}
        getSearchResult={searchAddresses}
        getStartPosition={getStartPosition}
        getCurrentAddress={getCurrentAddress}
        startPosition={startPosition}
      />
      <IonModal isOpen={isModalOpen} swipeToClose={true}>
        <IonToolbar>
          <IonButtons slot="start" color="light" onClick={closeModal}>
            <IonButton>
              {city}
              <IonIcon icon={caretDown} />
            </IonButton>
          </IonButtons>
          <IonSearchbar value={keywords} onIonChange={changeSearch}
            placeholder={typingEnd ? "您要去哪儿" : "您从哪里出发"}></IonSearchbar>
          <IonButtons color="light" slot="end" onClick={closeModal}>
            <IonButton>
              取消
          </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonContent>
          <IonList>
            {
              addressList && addressList.map((item: any, index: number) =>
                <IonItem key={index} button onClick={(e: any) => serachItemClick(index)}>
                  <IonLabel>
                    <h2>{item.name}</h2>
                    <p>{item.address}</p>
                  </IonLabel>
                </IonItem>
              )
            }

          </IonList>
        </IonContent>

      </IonModal>
      {
        mapMode === 'driving' ? <IonCard style={{
          height: '90%',
          padding: 10,
        }}>
          <IonToolbar>
            <IonText>
              <h3>订单待确认</h3>
              <p>
                起点： {startAddress}
              </p>
              <p>
                终点： {endAddress}
              </p>
              <p>出发时间：{moment(startTime).format('LLLL')}</p>
            </IonText>

          </IonToolbar>
          <section style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <IonButton onClick={cancelOrder}>取消</IonButton>
            <IonButton onClick={(e:any) => dispatch({
          ordering: true,
        })}>下单</IonButton>
          </section>
        </IonCard>
          :
          <IonCard style={{
            height: '63%'
          }}>
            <IonItem>
              <IonLabel>出发</IonLabel>
              <IonInput value={startAddress} placeholder="选择出发地址"
                onFocus={(_e: any) => showModal({ typingStart: true, typingEnd: false })}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>到达</IonLabel>
              <IonInput value={endAddress} placeholder="选择到达地址"
                onFocus={(_e: any) => showModal({ typingStart: false, typingEnd: true })}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>出发时间</IonLabel>
              <input type="datetime-local" onChange={(e: any) => dispatch({
                startTime: e.target.value,
              })} value={startTime} min={minStartTime} />
            </IonItem>
            <section style={{
              width: '100%'
            }}>
              <IonButton disabled={endAddress === ""} expand="block" onClick={confirmOrder}>确认</IonButton>
            </section>
          </IonCard>
      }
      <IonToast isOpen={showToast}
        onDidDismiss={() => dispatch({
          showToast: false,
        })}
        message="请选择到达位置"
        duration={200} />
      <IonLoading
        isOpen={ordering}
        onDidDismiss={() => dispatch({
          ordering: false,
        })}
        message={'正在下单'}
        duration={5000}
      />

    </IonPage>
  );
};

export default UseCarPage;
