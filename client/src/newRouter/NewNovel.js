import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import novel from "../css/novel.module.css";
import A from '../atom/A';
import { getStory } from './common/getData';
import { updateNovelView } from './common/updateData';

export default function NewNovel() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const round = searchParams.get("round");

  const [data, setData] = useState({});
  const [content, setContent] = useState([]);
  const [slideCount, setSlideCount] = useState(0);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);

  const lastPage = content.length - 1;

  useEffect(() => {
    const getData = async () => {
      const res = await getStory(params.id, round);
      if (res) {
        setData(res.data);
        const gapDelete = res.data.content.split('\n').filter(Boolean);
        setContent(gapDelete);
        // 마지막 회차 확인
        if (res.novel.round !== res.data.round) {
          setNext(res.data.round + 1);
        } else {
          setNext(null);
        }
        if (String(res.data.round) === '1') {
          setPrev(null);
        } else {
          setPrev(res.data.round - 1);
        }
      }
    }
    const updateView = async () => {
      await updateNovelView(params.id);
    }

    setSlideCount(0);
    updateView();
    getData();
  }, [params.id, round]);

  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setSlideCount((count) => count < lastPage ? count + 1 : count);
      }
      if (e.key === 'ArrowLeft') {
        setSlideCount((count) => Math.max(count - 1, 0));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lastPage]);

  return <>
    <main className={novel.novel}>
      <div className={novel.boxTop}>
        <div className={novel.titleBox}>
          <A url={"/n/" + params.id} className={novel.novelName}>{params.id}{data.round ? " · " + data.round + "화" : ""}</A>
          <h1 className={novel.title}>{data.title}</h1>
        </div>
        <A url={"/n/" + params.id} className={novel.infoBtn}>목록</A>
      </div>
      <section className={novel.slide}>
        <p className={novel.slideContent}>{content[slideCount]}</p>
        <button type="button" aria-label="이전 페이지" className={novel.slideLeftBtn} disabled={slideCount === 0} onClick={() => setSlideCount(slideCount - 1)}>‹</button>
        <button type="button" aria-label="다음 페이지" className={novel.slideRightBtn} disabled={slideCount >= lastPage} onClick={() => setSlideCount(slideCount + 1)}>›</button>
      </section>
      <div className={novel.control}>
        <span className={novel.page}>{content.length > 0 ? slideCount + 1 : 0} / {content.length}</span>
        <input className={novel.rangeInput} type="range" aria-label="페이지 이동" min={1} max={content.length} step={1} value={slideCount + 1} onChange={(e) => setSlideCount(Number(e.target.value) - 1)}></input>
        <div className={novel.prevNextBtnBox}>
          {prev === null ? <></> : <A className={novel.prevBtn} url={"/n/" + params.id + "/detail?round=" + prev}>이전화</A>}
          {next === null ? <></> : <A className={novel.nextBtn} url={"/n/" + params.id + "/detail?round=" + next}>다음화</A>}
        </div>
      </div>
      {slideCount === lastPage ? (
        <section className={novel.writerBox}>
          <h2 className={novel.writerTitle}>작가의 말</h2>
          <p className={novel.writerComment}>{data.writer_comment}</p>
        </section>
      ) : (
        <></>
      )}
    </main>
  </>
}
