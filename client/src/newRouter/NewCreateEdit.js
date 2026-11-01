import { useContext, useEffect, useState } from "react";
import create from "../css/create.module.css";
import form from "../css/form.module.css";
import A from "../atom/A";
import CoverUpload from "../molecule/CoverUpload";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginStateContext from '../store/loginState-context';
import { uploadCover } from "./common/upload";
import { getNovel } from "./common/getData";
import { updateNovel } from "./common/updateData";

export default function NewCreateEdit() {

  const login = useContext(LoginStateContext);
  const { writeName } = login;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [origin, setOrigin] = useState({});

  const isReady = title.length > 0 && summary.length >= 30 && fileUrl !== "";

  useEffect(() => {
    const getData = async () => {
      const res = await getNovel(id);
      if (res.result) {
        setTitle(res.data.title);
        setSummary(res.data.summary);
        setFileUrl(res.data.cover_img);
        setOrigin(res.data);
      }
    }
    getData()
  }, [])

  // 저장
  const handleSave = async () => {
    if (!writeName) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    if (title.length === 0) {
      alert("제목이 입력되지 않았습니다.");
      return;
    }
    if (summary.length < 30) {
      alert("줄거리는 30자 이상 입력되어야 합니다.");
      return;
    }

    // if (genre.length === 0) {
    //   alert("장르를 선택해 주세요.");
    //   return;
    // }

    if (fileUrl === "") {
      alert("커버 이미지를 업로드해 주세요!");
      return;
    }

    // 저장할 데이터
    const data = {
      write_name: writeName,
      title,
      summary,
      // genre,
      cover_img: fileUrl,
      round: 0,
      create_at: new Date()
    }

    // 저장 요청
    const res = await updateNovel(title, data, origin);
    if (res) {
      alert("수정되었습니다.");
      navigate('/');
    }
  }

  const handleCover = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const fileExt = file.name.split('.').pop();

    // 확장자 제한
    if (!['jpeg', 'png', 'jpg', 'JPG', 'PNG', 'JPEG', 'webp', 'WEBP'].includes(fileExt)) {
      alert('jpg, png, jpge, webp 파일만 업로드가 가능합니다.');
      return;
    }

    // 커버 이미지 업로드
    setIsUploading(true);
    try {
      const path = await uploadCover(file.name, file);
      setFileUrl(path);
    } catch (error) {
      console.error("커버 이미지 업로드 실패:", error);
      alert("커버 이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleFileInput = (e) => {
    if (!writeName) {
      e.preventDefault();
      alert("로그인 후 이용해 주세요.");
    }
  }

  return <>
    <main className={create.main}>
      <h1 className={create.heading}>작품 수정</h1>
      <div className={create.form}>
        <CoverUpload url={fileUrl} isUploading={isUploading} onClick={handleFileInput} onChange={handleCover} />
        <div className={create.fields}>
          <label className={create.field}>
            <span className={create.label}>작품 제목</span>
            {/* 제목은 문서 ID라서 수정할 수 없다 */}
            <input type="text" placeholder="작품 제목" className={form.inputLarge} value={title} readOnly></input>
          </label>
          <label className={create.field}>
            <span className={create.labelRow}>
              <span className={create.label}>줄거리</span>
              <span className={create.count}>{summary.length}자</span>
            </span>
            <textarea placeholder="줄거리" rows={9} className={form.textarea} value={summary} onChange={(e) => setSummary(e.target.value)}></textarea>
          </label>
          <div className={create.actions}>
            <A url={"/n/" + id} className={form.secondaryBtn}>취소</A>
            <button type="button" className={`${form.primaryBtn} ${isReady ? "" : form.idle}`} onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    </main>
  </>
}
