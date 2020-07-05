import { useState, useEffect } from "react";

const globalState = {
    authed: false,
}
export function useChechAuthed(){
  const [authed, setAuthed ] = useState(false);
  const token = localStorage.getItem('token');
    console.log('建成');
    
    useEffect(()=>{
          if(token){
            setAuthed(true);
            console.log('已经登录');
          }else{
            setAuthed(false);
            console.log("没有登录");
          }
        }, [token]);
    globalState.authed = authed;
    return globalState;
}