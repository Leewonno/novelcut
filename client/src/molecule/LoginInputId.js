import { useContext } from "react";
import LoginContext from "../store/login-context";

import Input from "../atom/Input"
import form from "../css/form.module.css"


export default function LoginInputId(){

    const value = useContext(LoginContext);
    return <>
        <Input placeholder="아이디" autoComplete="username" className={form.input} value={value.loginIdInput} onChange={(e)=>value.setLoginIdInput(e.target.value)}></Input>
    </>
}
