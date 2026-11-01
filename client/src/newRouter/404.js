import Header from "../organism/Header";
import Footer from "../organism/Footer";
import A from "../atom/A";
import notFound from "../css/notFound.module.css";

export default function NotFound(){
    return <>
        <Header />
        <main className={notFound.main}>
            <h1 className={notFound.title}>잘못된 접근입니다.</h1>
            <A url="/" className={notFound.home}>홈으로</A>
        </main>
        <Footer />
    </>
}
