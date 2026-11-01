import Button from "../atom/Button";
import Input from "../atom/Input";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function HeaderSearch(props){

    const navigator = useNavigate();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const query = pathname === "/search" ? (searchParams.get("q") ?? "") : "";

    const [search, setSearch] = useState(query);

    useEffect(()=>{
        setSearch(query);
    }, [query])

    const handleSearch = (e)=>{
        e.preventDefault();
        if(search.trim().length === 0){
            return;
        }
        navigator('/search?q=' + encodeURIComponent(search.trim()));
    }

    return <form className={props.searchBox} onSubmit={handleSearch}>
        <Input placeholder="검색어를 입력하세요" className={props.inputClass} value={search} onChange={(e)=>setSearch(e.target.value)}></Input>
        <Button type="submit" className={props.btnClass} ariaLabel="검색">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
        </Button>
    </form>
}
