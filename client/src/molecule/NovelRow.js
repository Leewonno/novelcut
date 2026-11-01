import A from "../atom/A";
import row from "../css/novelRow.module.css";

export default function NovelRow(props){
    return <>
        <A url={props.url} className={`${row.row} ${props.compact ? row.compact : ""}`}>
            {props.rank !== undefined ? <span className={row.rank}>{props.rank}</span> : <></>}
            <img className={row.cover} src={props.img} alt="" />
            <div className={row.text}>
                <div className={row.title}>{props.title}</div>
                <div className={row.sub}>{props.sub}</div>
            </div>
        </A>
    </>
}
