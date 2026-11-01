export default function Button(props){
    return <>
        <button type={props.type} onClick={props.onClick} onKeyDown={props.onKeyDown} className={props.className} aria-label={props.ariaLabel}>{props.children}</button>
    </>
}
