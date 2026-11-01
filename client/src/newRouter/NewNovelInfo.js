import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import A from '../atom/A';
import novelinfo from "../css/novelInfo.module.css";
import LoginStateContext from '../store/loginState-context';
import { useContext } from "react";
import { getNovel, getStoryList } from './common/getData';

export default function NewNovelInfo() {

  const params = useParams();

  const login = useContext(LoginStateContext);

  const [info, setInfo] = useState([]);
  const [list, setList] = useState([]);
  const [latest, setLatest] = useState(true);
  const [coverImg, setCoverImg] = useState('');

  useEffect(() => {
    const getData = async () => {
      const res = await getNovel(params.id)
      if (res.result) {
        setInfo([res.data]);
        setCoverImg(res.data.cover_img);
        const story = await getStoryList(params.id);
        setList(story);
      }
    }
    getData();
  }, [params])

  const sortedList = [...list].sort((a, b) => latest ? b.round - a.round : a.round - b.round);

  return <>
    <main className={novelinfo.novelinfo}>
      {info.map((value, index) => {
        return (
          <section key={index} className={novelinfo.infoBox}>
            <img className={novelinfo.coverImg} src={value.cover_img} alt={value.title + " 커버"}></img>
            <div className={novelinfo.dataBox}>
              <div className={novelinfo.dataBoxTop}>
                <div className={novelinfo.tagBox}>
                  <span className={novelinfo.tag}>{value.genre}</span>
                  <span className={novelinfo.tag}>연재중</span>
                </div>
                <h1 className={novelinfo.name}>{value.title}</h1>
                <div className={novelinfo.writer}>{value.write_name}</div>
              </div>
              <p className={novelinfo.summary}>{value.summary}</p>
              <div className={novelinfo.btnBox}>
                <A url={"/n/" + params.id + "/detail?round=1"} className={novelinfo.firstRound}>첫회보기</A>
                {login.writeName === value.write_name ? (
                  <A url={"/create/detail?id=" + value.title} className={novelinfo.editRound}>수정하기</A>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>
        )
      })}
      <section className={novelinfo.rounds}>
        <div className={novelinfo.roundHead}>
          <h2 className={novelinfo.roundInfo}>작품 회차 <span className={novelinfo.roundCount}>{list.length}</span></h2>
          <div className={novelinfo.toggle}>
            <button type="button" aria-pressed={latest} className={latest ? novelinfo.toggleActive : novelinfo.toggleBtn} onClick={() => setLatest(true)}>최신순</button>
            <button type="button" aria-pressed={!latest} className={latest ? novelinfo.toggleBtn : novelinfo.toggleActive} onClick={() => setLatest(false)}>첫화부터</button>
          </div>
        </div>
        <ul className={novelinfo.roundList}>
          {sortedList.map((value) => {
            return (
              <li key={value.round}>
                <A url={"/n/" + params.id + "/detail?round=" + value.round} className={novelinfo.roundItem}>
                  <img src={coverImg} className={novelinfo.roundImg} alt=""></img>
                  <div className={novelinfo.roundText}>
                    <div className={novelinfo.round}>{value.round}화</div>
                    <div className={novelinfo.title}>{value.title}</div>
                  </div>
                </A>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  </>
}
