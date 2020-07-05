import * as React from 'react';
import { Map } from 'react-amap';
import { IonIcon } from '@ionic/react';
import { pinSharp } from 'ionicons/icons';
interface ILocation {
    P: number,
    Q: number,
    lat: number,
    lng: number,
}

interface ICustAMapProps {
    city?: string,
    keywords?: string,
    endPosition?: ILocation,
    mode: string,
    getSearchResult: (list: any) => void,
    getStartPosition: (local: ILocation) => void,
    getCurrentAddress: (address: string) => void,
    startPosition?: ILocation,
}

interface IMapState {
    map: any,
    geo: any,
    center: ILocation | null,
    lineDone: boolean,
    label: string,
    AMap: any,
    driving: any,
    currentCity: string,
    currentKeyWords: string,
}

const initState: IMapState = {
    map: null,
    geo: null,
    center: null,
    lineDone: false,
    label: '正在获取地址',
    AMap: null,
    driving: null,
    currentCity: '成都市',
    currentKeyWords: "",
}


function reducer(state: IMapState, action: any) {
    return {
        ...state,
        ...action,
    }

}

let frozen = false;
export default function CustAMap(props: ICustAMapProps) {

    const { city, startPosition, keywords, getSearchResult, getStartPosition, getCurrentAddress, endPosition, mode } = props;

    const [state, dispatch] = React.useReducer(reducer, initState as any);
    const { lineDone, map, center, geo, currentCity, label, AMap, currentKeyWords } = state as IMapState;

    const searchList = () => {
        AMap.plugin('AMap.Autocomplete', () => {
            const autoOptions = {
                city
            }

            const autoComplete = new (window as any).AMap.Autocomplete(autoOptions);
            autoComplete.search(keywords, function (status: any, result: any) {
                // 搜索成功时，result即是对应的匹配数据
                if (getSearchResult) {
                    getSearchResult(result.tips ? result.tips.filter((tip: any) => tip.id !== "" && !Array.isArray(tip.address)) : [])
                }

            })

        })
    }
    const markMap = (newCenter: any) => {
     
        if (frozen) {
            return false;
        }
        map.clearMap();
        map.setZoom(17);
        AMap.plugin('AMap.Geocoder', () => {
            const geocoder = new AMap.Geocoder({
                city,
                radius: 500 //范围，默认：500
            });
            if (getStartPosition) {
                getStartPosition(newCenter);
            }
            geocoder.getAddress(newCenter, (status: string, result: any) => {
                console.log({mode, lineDone});
                console.log(status, result);
                if (frozen) {
                    return false;
                }
                if (status === 'complete' && result.regeocode) {
                    const address = result.regeocode.formattedAddress;
                    const currentAddress = address.split('市')[1];
                    if (getCurrentAddress) {
                        getCurrentAddress(currentAddress);
                    }
                    dispatch({
                        label: currentAddress,
                        center: newCenter,
                    })
                } else {
                    console.log("失败了啊");

                    console.error('失败');
                }
            });
        })

    }

    const planCarLine = () => {
        AMap.plugin('AMap.Driving', () => {
            const driving = new AMap.Driving({
                map,
            });
            dispatch({
                driving,
                lineDone: true,
            })
            if (startPosition && endPosition) {
                driving.search(
                    new AMap.LngLat(startPosition.lng, startPosition.lat),
                    new AMap.LngLat(endPosition.lng, endPosition.lat),
                    (status: string, result: any) => {
                        console.log('规划的路线', {
                            status, result
                        });
                        // result 即是对应的驾车导航信息，
                        const { routes } = result;
                        const { time } = routes[0];
                        dispatch({
                            label: `路程约${(time/60).toFixed(2)}分钟`
                        })
                        if (status === 'complete') {
                            dispatch({
                                lineDone: true,
                            })
                        } else {
                            console.error(result);
                        }
                    });
            } else {
                console.log("规划失败");
            }


        })
    }

    const getCurrentPosition = () => {
        if (AMap && geo) {
            console.log('getCurrentPosition',{mode, lineDone});
            geo.getCurrentPosition();
            AMap.event.addListener(geo, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geo, 'error', onError);      //返回定位出错信息
        }

    }

    const onComplete = (data: any) => {
        console.log("刚刚完成定位", data);
        if (lineDone) {
            return false;
        }
        if (data.message.includes('Get ipLocation failed')) {
            map.setCity(city);
            map.setZoom(20);
            setTimeout(() => {
                const newCenter = map.getCenter();
                markMap(newCenter);
            }, 1200)


        } else {
            const { position, formattedAddress, addressComponent } = data;
            if (addressComponent) {
                const { city } = addressComponent;
                map.setCenter(position);
                dispatch({
                    currentCity: city,
                    label: formattedAddress,
                })
                markMap(position);
            } else {
                map.setCity(currentCity);
                const center = map.getCenter();
                dispatch({
                    center,
                })
                markMap(center);
            }

        }
    }
    const onError = (data: any) => {
        console.log('定位失败', data);
        map.setCity(currentCity);
        const center = map.getCenter();
        dispatch({
            center,
        })
        markMap(center);
    }




    const amapEvents = {
        created: (mapInstance: any) => {
            dispatch({
                map: mapInstance,
                AMap: (window as any).AMap,
            })
            mapInstance.plugin('AMap.Geolocation', () => {
                const geolocation = new (window as any).AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new (window as any).AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                dispatch({
                    geo: geolocation,
                })
            });
        }
    };
   

    React.useEffect(() => {
        if (AMap && map && mode === 'driving') {
            frozen = true;
          
            dispatch({
                lineDone: true,
            })
        
          
        }
    }, [AMap, map, geo, mode, keywords])

    React.useEffect(()=>{
        if(lineDone){
            planCarLine();
        }
    }, [lineDone])

    React.useEffect(()=>{
        if(map && mode==="position"){
            console.log('重新定位');
            frozen=false;
            dispatch({
                lineDone: false,
            })
            map.clearMap();
            markMap(startPosition);
        }
    }, [mode, map])

    React.useEffect(() => {
        if (AMap && map && geo &&  mode !== 'driving') {
            if (!lineDone) {
                console.log('绑定了新地图事件');
                getCurrentPosition();
                map.on('movestart', mapMoveStart);
                map.on('moveend', mapMoveEnd);
            }
        }
    }, [AMap, map, geo])

    React.useEffect(() => {
        if (AMap && map && mode === 'search' && keywords !== currentKeyWords) {
            map.clearMap();
            dispatch({
                mode: 'search',
                lineDone: false,
            });
            frozen = false;
            searchList();
        }

    }, [AMap, map, geo, mode, keywords])




    React.useEffect(() => {
        if (AMap && map && mode === 'search' && startPosition &&
            (startPosition.lat !== center?.lat || startPosition.lng !== center.lng)
        ) {
            map.setCenter(startPosition);
            markMap(startPosition);
        }
        
    }, [AMap, map, geo, mode, keywords, startPosition, center])


    const mapMoveStart = () => {
        console.log('move start');
        if(frozen){
            return true;
        }
        dispatch({
            label: '正在获取地址'
        })

    }

    const mapMoveEnd = () =>  {
        const { mode } = props;
        const { lineDone } = state;
        console.log('move end');
        console.log({mode, lineDone, frozen});
        if(frozen){
            return true;
        }
        
        if(mode === "driving"){
            return false;
        }
        if (!lineDone || mode !== 'driving') {
            const newCenter = map.getCenter();
            markMap(newCenter);
        }else{
            console.log("不重新定位位置");
        }
    }
    console.log("每次", mode, lineDone, label);

    return (
        <>
            <Map resizeEnable={true} amapkey={`b3f96fe4c99145e7a7b10105fa92a31e`} events={amapEvents} />
         <div style={{
                    position: 'absolute',
                    fontSize: 'larger',
                    left: '49%',
                    top: '30.5%'
                }}>
                    <IonIcon icon={pinSharp} style={{
                        color: 'green'
                    }} />
                    <span style={{
                        fontSize: 'small',
                        background: 'white'
                    }}>{label}</span>
                </div>

        </>
    )
}