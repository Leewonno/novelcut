import create from "../css/create.module.css";

export default function CoverUpload(props){
    return <>
        <label onClick={props.onClick} className={create.cover}>
            <input accept="image/*" type="file" hidden onChange={props.onChange}></input>
            {props.url ? (
                <>
                    <img alt="커버" src={props.url} className={create.coverImg} />
                    <span className={create.coverChange}>{props.isUploading ? "업로드 중..." : "이미지 변경"}</span>
                </>
            ) : (
                <>
                    <span className={create.coverPlus}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>
                    </span>
                    <span className={create.coverText}>
                        <span className={create.coverTitle}>{props.isUploading ? "업로드 중..." : "커버 이미지 업로드"}</span>
                        <span className={create.coverHint}>3:4 비율 권장</span>
                    </span>
                </>
            )}
        </label>
    </>
}
