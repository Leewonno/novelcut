import { Scissor } from "akar-icons";
import A from "../atom/A";

export default function HeaderLogo(props){
    return <>
        <A url="/" className={props.className}><Scissor size={20} aria-hidden="true" />NOVELCUT</A>
    </>
}
