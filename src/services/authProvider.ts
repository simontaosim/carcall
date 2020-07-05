import { SERVER_ORIGIN } from "../constants";

interface ILoginParams {
    username: string,
    password: string,
}
interface IAuthResult {
    token?: string,
    code?: string,
    msg?: string,
    reason?: string,
    userId?: number,
    
}
interface IRegisterParams {
    username: string,
    password: string,
    passwordRepeat?: string,
}

const headers: any= {
    'content-type': 'application/json',
    'Accept': 'application/json' 
}; 
export default {
    login:  async (params: ILoginParams): Promise<any>=>{
        const url = `${SERVER_ORIGIN}}/login`;
        return fetch(url, {method: "POST", headers, body: JSON.stringify(params)}).then((response: Response)=>{
            return response.json()
        }).then(({token, code, msg, userId}: IAuthResult)=> {
            if(token){
                localStorage.setItem("token", token);
                if(userId){
                    localStorage.setItem("userId", userId.toString());
                }
            }
            return {
                token, code, msg,
            }
        })
    },
    register: async (params: IRegisterParams): Promise<any> => {
        const url = `${SERVER_ORIGIN}/register`;
        return fetch(url, {method: "POST", headers, body: JSON.stringify(params)}).then((response: Response)=>{
            return response.json()
        }).then(({token, code, msg, reason, userId}: IAuthResult)=> {
            if(token){
                localStorage.setItem("token", token);
            }
            if(userId){
                localStorage.setItem("userId", userId.toString());
            }
            return {
                token, code, msg, reason, userId
            }
        })
    },

    check: async (token:string)=>{
        const url = `${SERVER_ORIGIN}/check`;
        if(token){
            headers["Authorization"] = `Bearer ${token}`
        }
        return fetch(url, {method: "GET", headers}).then((response: Response)=>{
            return response.json()
        }).then(({isLogined}: { isLogined: boolean})=> {
            if(isLogined){
                return true;
            }
            return false;
        })
    }
}