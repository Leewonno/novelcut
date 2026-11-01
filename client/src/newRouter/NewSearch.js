import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import search from "../css/search.module.css";
import NovelRow from "../molecule/NovelRow";
import { getSearchData } from "./common/getData";


export default function NewSearch() {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [novelList, setNovelList] = useState([]);
  const [writerList, setWriterList] = useState([]);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const getData = async () => {
      setTab("all");
      if (query.length === 0) {
        setNovelList([]);
        setWriterList([]);
        return;
      }
      const res = await getSearchData(query);
      if (res) {
        const { title, writer } = res;
        setNovelList(title);
        setWriterList(writer);
      }
    }
    getData();
  }, [query])

  // 필명은 완전 일치로 검색되므로 결과의 작가는 한 명이다
  const writerCount = writerList.length > 0 ? 1 : 0;
  const writerName = writerCount > 0 ? writerList[0].write_name : "";

  const tabs = [
    { id: "all", label: "전체", count: novelList.length + writerCount },
    { id: "title", label: "작품명", count: novelList.length },
    { id: "writer", label: "필명", count: writerCount },
  ];

  return <>
    <main className={search.search}>
      <div className={search.head}>
        <h1 className={search.word}>‘{query}’에 대한 검색결과</h1>
        <div className={search.tabs}>
          {tabs.map((value) => {
            return (
              <button type="button" key={value.id} aria-pressed={tab === value.id} className={tab === value.id ? search.tabActive : search.tab} onClick={() => setTab(value.id)}>
                <span>{value.label}</span><span>{value.count}</span>
              </button>
            )
          })}
        </div>
      </div>
      {tab !== "writer" ? (
        <section className={search.section}>
          <h2 className={search.title}>작품명 검색결과 <span className={search.count}>{novelList.length}</span></h2>
          {novelList.length === 0 ? <div className={search.empty}>일치하는 작품이 없어요.</div> : <></>}
          <div className={search.list}>
            {novelList.map((value, index) => {
              return <NovelRow key={index} url={"/n/" + value.title} img={value.cover_img} title={value.title} sub={value.write_name + " · " + value.genre} />
            })}
          </div>
        </section>
      ) : (
        <></>
      )}
      {tab !== "title" ? (
        <section className={search.section}>
          <h2 className={search.title}>필명 검색결과 <span className={search.count}>{writerCount}</span></h2>
          {writerCount === 0 ? <div className={search.empty}>일치하는 필명이 없어요.</div> : (
            <div className={search.writer}>
              <div className={search.writerInitial}>{writerName[0]}</div>
              <div className={search.writerText}>
                <div className={search.writerName}>{writerName}</div>
                <div className={search.writerWorks}>작품 {writerList.length}개</div>
              </div>
            </div>
          )}
          <div className={search.list}>
            {writerList.map((value, index) => {
              return <NovelRow key={index} url={"/n/" + value.title} img={value.cover_img} title={value.title} sub={value.write_name + " · " + value.genre} />
            })}
          </div>
        </section>
      ) : (
        <></>
      )}
    </main>
  </>
}
