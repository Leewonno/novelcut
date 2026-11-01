import { useContext } from "react";
import LoginContext from "../store/login-context";

import Input from "../atom/Input"
import form from "../css/form.module.css"

export default function LoginInputPw(){
    const value = useContext(LoginContext);

    return <>
        <Input
            placeholder="비밀번호" 
            type="password" 
            autoComplete="current-password"
            className={form.input} 
            value={value.loginPwInput} 
            onChange={(e)=>value.setLoginPwInput(e.target.value)}
        />
    </>
}
