import LoginBox from "../organism/LoginBox"
import login from "../css/login.module.css";

import {LoginProvider} from '../store/login-context';

export default function NewLogin(){
    return <>
        <main className={login.main}>
            <LoginProvider>
                <LoginBox />
            </LoginProvider>
        </main>
    </>
}
