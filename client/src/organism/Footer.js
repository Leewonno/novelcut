import footer from "../css/footer.module.css";

export default function Footer() {

    const handleNone = () => {
        alert("준비중입니다.")
    }

    return (
        <footer className={footer.footer}>
            <div className={footer.footerBox}>
                <nav className={footer.informationBox}>
                    <button type="button" onClick={handleNone} className={footer.information}>공지사항</button>
                    <button type="button" onClick={handleNone} className={footer.informationStrong}>개인정보보호정책</button>
                    <button type="button" onClick={handleNone} className={footer.information}>고객센터</button>
                    <button type="button" onClick={handleNone} className={footer.information}>제휴문의</button>
                </nav>
                <div className={footer.myArea}>
                    포스코 코딩온 웹 풀스택 과정 프로젝트3 이원노
                </div>
            </div>
        </footer>
    )
}
