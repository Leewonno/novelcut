import { useEffect, useContext, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"
import LoginStateContext from '../store/loginState-context';
import edit from '../css/edit.module.css';
import form from '../css/form.module.css';

export default function EditPatch(){

    const login = useContext(LoginStateContext);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const novel_id = searchParams.get("id");
    const round = searchParams.get("round");

    const [novelName, setNovelName] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writerComment, setWriterComment] = useState("");

    useEffect(()=>{
        const getData = async ()=>{
            const res = await axios({
                method:"GET",
                url:"https://port-0-novelcutserver-12fhqa2blnvnggha.sel5.cloudtype.app/novel/round/edit",
                params:{
                    novel_id,
                    round
                }
            })
            setNovelName(res.data.info[0].novelName);
            setTitle(res.data.info[0].title);
            setContent(res.data.info[0].content);
            setWriterComment(res.data.info[0].writer_comment);
        }

        getData();
    }, [])


    const handleContent = (e)=>{
        setContent(e.target.value);
    }

    const handleRoundUpdate = async ()=>{

        if(login.id.length===0){
            alert("로그인 후 이용해주세요!");
            return;
        }

        if(title.length < 1){
            alert("회차 제목을 입력하세요!");
            return;
        }

        if(content.length < 100){
            alert("소설의 내용은 100자 이상 입력되어야 합니다.");
            return;
        }

        if(writerComment < 1){
            alert("작가의 말을 입력해주세요!");
            return;
        }

        const round_res = await axios({
            method:"PATCH",
            url:"https://port-0-novelcutserver-12fhqa2blnvnggha.sel5.cloudtype.app/patch/round/novel",
            data:{
                id:novel_id,
                round,
                content:content,
                title:title,
                writer_comment:writerComment,
            }
        })

        if(round_res.data.result){
            alert("회차가 업데이트 되었습니다!");
            navigate("/");
        }
    }


    return <>
        <main className={edit.edit}>
            <div className={edit.headingBox}>
                <span className={edit.roundLabel}>{round}화 수정</span>
                <h1 className={edit.novelName}>{novelName}</h1>
            </div>
            <input placeholder="회차 제목" aria-label="회차 제목" value={title} onChange={(e)=>setTitle(e.target.value)} className={form.inputLarge}></input>
            <label className={edit.field}>
                <span className={edit.labelRow}>
                    <span className={edit.label}>본문</span>
                    <span className={edit.count}>{content.length.toLocaleString()}자</span>
                </span>
                <textarea rows={18} className={form.textareaBody} spellCheck={false} onChange={(e)=>handleContent(e)} value={content}></textarea>
            </label>
            <label className={edit.field}>
                <span className={edit.label}>작가의 말</span>
                <textarea placeholder="작가의 말" rows={4} className={form.textareaNote} spellCheck={false} onChange={(e)=>setWriterComment(e.target.value)} value={writerComment}></textarea>
            </label>
            <div className={edit.saveBtnBox}>
                <button type="button" className={form.primaryBtn} onClick={handleRoundUpdate}>수정</button>
            </div>
        </main>
    </>
}
