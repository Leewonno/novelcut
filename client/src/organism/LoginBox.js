import Button from "../atom/Button";
import login from "../css/login.module.css";
import A from "../atom/A";
import LoginInputId from "../molecule/LoginInputId";
import LoginInputPw from "../molecule/LoginInputPw";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginContext from "../store/login-context";
import { postLogin } from "../newRouter/common/postData";

export default function LoginBox() {

    const context = useContext(LoginContext);
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (context.loginIdInput.length === 0 || context.loginPwInput.length === 0){
            setError(true);
            return;
        }
        setError(false);
        const data = {
            email: context.loginIdInput,
            password: context.loginPwInput,
        }
        const res = await postLogin(data);
        if (res) {
            const user = {
                email: res.email,
                name: res.name,
                nick: res.nick,
                write_name: res.write_name,
            }
            context.setCookie("user", user);
            navigate("/");
        }
    }

    const handleNone = () => {
        alert("준비중입니다.")
    }

    return <>
        <form className={login.box} onSubmit={handleLogin}>
            <div className={login.head}>
                <h1 className={login.title}>로그인</h1>
                <p className={login.desc}>NOVELCUT에서 읽던 이야기를 이어보세요</p>
            </div>
            <div className={login.input_box}>
                <LoginInputId />
                <LoginInputPw />
                {error ? <div role="alert" className={login.error}>아이디와 비밀번호를 입력해주세요.</div> : <></>}
            </div>
            <div className={login.button_box}>
                <Button type="submit" className={login.login_btn}>로그인</Button>
                <div className={login.signup_box}>
                    <A url="/signup" className={login.link}>회원가입</A>
                    <span className={login.divider}></span>
                    <button type="button" className={login.link} onClick={handleNone}>비밀번호 찾기</button>
                </div>
            </div>
        </form>
    </>
}
