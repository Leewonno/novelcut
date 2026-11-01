import { useState, useEffect } from "react";
import main from "../css/main.module.css";
import A from "../atom/A";
import NovelRow from "../molecule/NovelRow";
import { getPopularNovelList, getReconetNovelList } from "./common/getData";

const contestSlide = {
  eyebrow: "2023 웹소설 공모전 · 로맨스 / 로판",
  title: <>지상최대<br />웹소설 공모전</>,
  desc: <>2ROUND 지금은 예심 기간!<br />10월 24일 화요일 최종심 진출작 발표!</>,
  cta: "공모전 참여작 감상하기",
  url: "/sort",
};

export default function NewMain() {

  const [slideCount, setSlideCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [recentNovel, setRecentNovel] = useState([]);
  const [popularNovel, setPopularNovel] = useState([]);

  const topNovel = popularNovel[0];
  const slides = topNovel ? [contestSlide, {
    eyebrow: "추천작",
    title: topNovel.title,
    desc: "독자들이 가장 많이 찾은 인기 연재작.",
    cta: "첫 화 보기",
    url: topNovel.round > 0 ? "/n/" + topNovel.title + "/detail?round=1" : "/n/" + topNovel.title,
  }] : [contestSlide];
  const slideLength = slides.length;
  const current = slides[slideCount % slideLength];

  useEffect(() => {
    const getRecentData = async () => {
      const res = await getReconetNovelList();
      setRecentNovel(res);
    }

    const getPopularData = async () => {
      const res = await getPopularNovelList();
      setPopularNovel(res);
    }
    getRecentData();
    getPopularData();
  }, []);

  // 슬라이드 위에 마우스나 포커스가 있으면 멈추고, 수동으로 넘기면 타이머를 다시 시작한다
  useEffect(() => {
    if (isPaused) {
      return;
    }
    const timer = setInterval(() => {
      setSlideCount((nextCount) => (nextCount + 1) % slideLength);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideLength, isPaused, slideCount]);

  const handleNext = () => {
    setSlideCount((nextCount) => (nextCount + 1) % slideLength);
  };

  const handlePrev = () => {
    setSlideCount((prevCount) => (prevCount - 1 + slideLength) % slideLength);
  };

  const handleNone = () => {
    alert("준비중입니다.")
  }

  return (
    <>
      <main className={main.main}>
        <div className={main.first}>
          <section
            className={main.slide}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div className={main.slideEyebrow}>{current.eyebrow}</div>
            <div className={main.slideBody}>
              <h1 className={main.slideTitle}>{current.title}</h1>
              <p className={main.slideDesc}>{current.desc}</p>
            </div>
            <A url={current.url} className={main.slideCta}>{current.cta}</A>
            <div className={main.slideControl}>
              <span className={main.slideCount}>0{(slideCount % slideLength) + 1} / 0{slideLength}</span>
              <div className={main.slideBtnBox}>
                <button type="button" aria-label="이전 슬라이드" className={main.slideBtn} onClick={handlePrev}>‹</button>
                <button type="button" aria-label="다음 슬라이드" className={main.slideBtn} onClick={handleNext}>›</button>
              </div>
            </div>
          </section>
          <aside className={main.recent}>
            <h2 className={main.recentTitle}>최신작품</h2>
            {recentNovel.map((value, index) => {
              return (
                <NovelRow
                  key={index}
                  compact
                  url={"/n/" + value.title}
                  img={value.cover_img}
                  title={value.title}
                  sub={value.genre + " · " + value.round + "화"}
                />
              )
            })}
          </aside>
        </div>
        <section className={main.popular}>
          <div className={main.popularHead}>
            <h2 className={main.popularTitle}>인기작품</h2>
            <A url="/sort" className={main.popularMoreBtn}>더보기</A>
          </div>
          <div className={main.popularBox}>
            {popularNovel.map((value, index) => {
              return (
                <A url={"/n/" + value.title} key={index} className={main.popularItem}>
                  <img className={main.popularCoverImg} src={value.cover_img} alt=""></img>
                  <div className={main.popularInfo}>
                    <span className={main.popularRank}>{index + 1}</span>
                    <div className={main.popularText}>
                      <div className={main.popularName}>{value.title}</div>
                      <div className={main.popularGenre}>{value.genre}</div>
                    </div>
                  </div>
                </A>
              )
            })}
          </div>
        </section>
        <section className={main.boxCS}>
          <A url="/create" className={main.action}>
            <span className={main.actionTitle}>작품생성</span>
            <span className={main.actionDesc}>새 작품을 등록하고 연재를 시작합니다</span>
          </A>
          <button type="button" className={main.action} onClick={handleNone}>
            <span className={main.actionTitle}>투고하기</span>
            <span className={main.actionDesc}>공모전 및 원고 투고</span>
          </button>
          <button type="button" className={main.action} onClick={handleNone}>
            <span className={main.actionTitle}>신고하기</span>
            <span className={main.actionDesc}>부적절한 작품이나 댓글 신고</span>
          </button>
        </section>
      </main>
    </>
  )
}
