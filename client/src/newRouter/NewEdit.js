import { useEffect, useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus } from "akar-icons";
import A from "../atom/A"
import LoginStateContext from '../store/loginState-context';
import edit from '../css/edit.module.css';
import form from '../css/form.module.css';
import { getNovelList } from "./common/getData";
import { createStory } from "./common/postData";

export default function NewEdit() {

  const login = useContext(LoginStateContext);
  const { id } = login;
  const navigate = useNavigate();

  const [novelList, setNovelList] = useState([]);
  const [novelId, setNovelId] = useState('');
  const [novelName, setNovelName] = useState("작품을 선택해주세요.");
  const [novelRound, setNovelRound] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writerComment, setWriterComment] = useState("");

  const isReady = novelId !== '' && title.length > 0 && content.length >= 100 && writerComment.length > 0;

  useEffect(() => {
    const loadList = async () => {
      const res = await getNovelList(id);
      if (res) {
        setNovelList(res);
      }
    }
    loadList();
  }, [login])

  const handleSelect = (e) => {
    if (e.target.value === '') {
      setNovelId('');
      setNovelName("작품을 선택해주세요.");
      setNovelRound(0);
      return;
    }
    novelList.forEach(element => {
      if (element.title === e.target.value) {
        setNovelId(element.title);
        setNovelName(element.title);
        setNovelRound(element.round + 1);
      }
    });
  }

  const handleContent = (e) => {
    setContent(e.target.value);
  }

  const handleRoundSave = async () => {
    if (login.id.length === 0) {
      alert("로그인 후 이용해주세요!");
      return;
    }

    if (novelId === '') {
      alert("작품을 선택해주세요!");
      return;
    }

    if (title.length < 1) {
      alert("회차 제목을 입력하세요!");
      return;
    }

    if (content.length < 100) {
      alert("소설의 내용은 100자 이상 입력되어야 합니다.");
      return;
    }

    if (writerComment.length < 1) {
      alert("작가의 말을 입력해주세요!");
      return;
    }
    const data = {
      novel_id: novelId,
      round: novelRound,
      content: content,
      title: title,
      writer_comment: writerComment,
    }
    const res = await createStory(novelId, data);
    if (res) {
      alert("회차가 업데이트 되었습니다!");
      navigate("/");
    }
  }


  return <>
    <main className={edit.edit}>
      <div className={edit.novelSelectBox}>
        <div className={edit.selectWrap}>
          <select aria-label="작품 선택" value={novelId} onChange={(e) => handleSelect(e)} className={edit.novelSelect}>
            <option value="">작품 선택</option>
            {novelList.map((value, index) => {
              return <option key={index} value={value.title}>{value.title}</option>
            })}
          </select>
          <ChevronDown className={edit.chevron} size={14} color="#111111" strokeWidth={2.4} aria-hidden="true" />
        </div>
        <A url="/create" className={edit.newNovel}>
          <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
          새 작품
        </A>
      </div>
      <div className={edit.headingBox}>
        {novelId !== '' ? <span className={edit.roundLabel}>{novelRound}화 등록</span> : <></>}
        <h1 className={edit.novelName}>{novelName}</h1>
      </div>
      <input placeholder="회차 제목" aria-label="회차 제목" value={title} onChange={(e) => setTitle(e.target.value)} className={form.inputLarge}></input>
      <label className={edit.field}>
        <span className={edit.labelRow}>
          <span className={edit.label}>본문</span>
          <span className={edit.count}>{content.length.toLocaleString()}자</span>
        </span>
        <textarea placeholder="이야기를 시작해보세요" rows={18} className={form.textareaBody} spellCheck={false} value={content} onChange={(e) => handleContent(e)}></textarea>
      </label>
      <label className={edit.field}>
        <span className={edit.label}>작가의 말</span>
        <textarea placeholder="작가의 말" rows={4} className={form.textareaNote} spellCheck={false} value={writerComment} onChange={(e) => setWriterComment(e.target.value)}></textarea>
      </label>
      <div className={edit.saveBtnBox}>
        <button type="button" className={`${form.primaryBtn} ${isReady ? "" : form.idle}`} onClick={handleRoundSave}>저장</button>
      </div>
    </main>
  </>
}
