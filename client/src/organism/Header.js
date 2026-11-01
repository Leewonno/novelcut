import HeaderLogo from "../molecule/HeaderLogo";
import HeaderSearch from "../molecule/HeaderSearch";
import HeaderLogin from "../molecule/HeaderLogin";
import HeaderLogout from "../molecule/HeaderLogout";
import A from "../atom/A";
import header from "../css/header.module.css";
import LoginStateContext from '../store/loginState-context';
import { useContext } from "react";
import { useLocation } from "react-router-dom";

export default function Header(){

    const login = useContext(LoginStateContext);
    const { pathname } = useLocation();

    const isSerial = pathname === "/" || pathname.startsWith("/sort") || pathname.startsWith("/n/");
    const isWriting = pathname.startsWith("/edit") || pathname.startsWith("/create");

    return(
        <header className={header.header}>
            <div className={header.box}>
                <HeaderLogo className={header.logo}></HeaderLogo>
                <nav className={header.nav}>
                    <A className={isSerial ? header.navActive : header.navItem} url="/sort">연재작품</A>
                    {login.isLogin ? <A className={isWriting ? header.navActive : header.navItem} url="/edit">내 작품/글쓰기</A> : <></>}
                </nav>
                <div className={header.spacer}></div>
                <HeaderSearch
                    searchBox={`${header.sc_box} ${pathname === "/search" ? header.sc_boxActive : ""}`}
                    inputClass={header.search}
                    btnClass={header.search_btn}
                ></HeaderSearch>
                {login.isLogin ? <HeaderLogout btnClass={header.login}></HeaderLogout> : <HeaderLogin btnClass={pathname === "/login" ? header.loginActive : header.login}></HeaderLogin> }
            </div>
        </header>
    )
}
