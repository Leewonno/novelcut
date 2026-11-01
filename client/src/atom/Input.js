export default function Input(props){
    return <>
        <input value={props.value} placeholder={props.placeholder} className={props.className} type={props.type} onChange={props.onChange} onKeyDown={props.onKeyDown} autoComplete={props.autoComplete}></input>
    </>
}
