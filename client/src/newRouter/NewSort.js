import { useEffect, useState } from "react";
import sort from "../css/sort.module.css";
import NovelRow from "../molecule/NovelRow";
import { getSortData } from "./common/getData";

export default function NewSort() {

  const [novelList, setNovelList] = useState([]);
  const [roundList, setRoundList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const {popular, recent } = await getSortData();
      setNovelList(popular);
      setRoundList(recent);
    }

    getData();
  }, [])

  return <>
    <main className={sort.sort}>
      <section className={sort.section}>
        <h2 className={sort.title}>인기작품</h2>
        {novelList.map((value, index) => {
          return <NovelRow key={index} rank={index + 1} url={"/n/" + value.title} img={value.cover_img} title={value.title} sub={value.write_name} />
        })}
      </section>
      <section className={sort.section}>
        <h2 className={sort.title}>최신 연재 회차</h2>
        {roundList.map((value, index) => {
          return <NovelRow key={index} url={value.round > 0 ? "/n/" + value.title + "/detail?round=" + value.round : "/n/" + value.title} img={value.cover_img} title={value.title} sub={value.write_name} />
        })}
      </section>
    </main>
  </>
}
