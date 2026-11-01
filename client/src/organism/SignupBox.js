import { useState } from "react";
import { Check } from "akar-icons";
import A from "../atom/A";
import form from "../css/form.module.css";
import signup from "../css/signup.module.css";
import { postSignUp } from "../newRouter/common/postData";

const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
const writeNameRegex = /^[a-zA-Z가-힣0-9\s]+$/;

const steps = [
    { key: "id", label: "아이디", question: "사용할 아이디를 입력해주세요", help: "로그인할 때 사용할 이메일 주소를 입력해주세요.", type: "text", inputMode: "email", autoComplete: "username" },
    { key: "pw", label: "비밀번호", question: "비밀번호를 정해주세요", help: "영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.", type: "password", autoComplete: "new-password" },
    { key: "pwCheck", label: "비밀번호 확인", question: "비밀번호를 한 번 더 입력해주세요", help: "앞에서 입력한 비밀번호와 같아야 합니다.", type: "password", autoComplete: "new-password" },
    { key: "name", label: "이름", question: "이름을 알려주세요", help: "본인 확인에만 사용되며 공개되지 않습니다.", type: "text", autoComplete: "name" },
    { key: "nick", label: "닉네임", question: "닉네임을 정해주세요", help: "서비스에서 사용할 닉네임입니다.", type: "text", autoComplete: "nickname" },
    { key: "writeName", label: "필명", question: "작가로 활동할 필명을 정해주세요", help: "작품에 작가 이름으로 표시됩니다.", type: "text", autoComplete: "off" },
];

const validate = (key, label, value, values) => {
    if (value.trim().length === 0) {
        return `${label}을(를) 입력해주세요.`;
    }
    if (key === "id" && !emailRegex.test(value)) {
        return "아이디는 이메일 형식으로 입력해주세요.";
    }
    if (key === "pw" && !passwordRegex.test(value)) {
        return "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.";
    }
    if (key === "pwCheck" && value !== values.pw) {
        return "비밀번호가 일치하지 않습니다.";
    }
    if (key === "writeName" && !writeNameRegex.test(value)) {
        return "필명은 한글, 영문, 숫자만 사용할 수 있습니다.";
    }
    return "";
};

export default function SingupBox(){

    const [stepIndex, setStepIndex] = useState(0);
    const [values, setValues] = useState({});
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const step = steps[stepIndex];
    const value = values[step.key] || "";
    const isLast = stepIndex === steps.length - 1;

    const handleChange = (e) => {
        setValues({ ...values, [step.key]: e.target.value });
        setError("");
    };

    const handleBack = () => {
        setStepIndex(stepIndex - 1);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }
        const message = validate(step.key, step.label, value, values);
        if (message) {
            setError(message);
            return;
        }
        if (!isLast) {
            setStepIndex(stepIndex + 1);
            return;
        }
        setIsSubmitting(true);
        const res = await postSignUp({
            email: values.id,
            password: values.pw,
            name: values.name,
            nick: values.nick,
            write_name: values.writeName,
        });
        setIsSubmitting(false);
        if (res) {
            setIsDone(true);
        }
    };

    if (isDone) {
        const summary = [
            { label: "아이디", value: values.id },
            { label: "이름", value: values.name },
            { label: "닉네임", value: values.nick },
            { label: "필명", value: values.writeName },
        ];
        return <>
            <div className={signup.box}>
                <div className={signup.done}>
                    <div className={signup.check}>
                        <Check size={26} strokeWidth={2.6} aria-hidden="true" />
                    </div>
                    <div className={signup.doneDesc}>
                        <h1 className={signup.title}>{values.nick}님, 환영합니다</h1>
                        <p className={signup.help}>가입이 완료되었습니다.</p>
                    </div>
                    <div className={signup.summary}>
                        {summary.map((item) => {
                            return (
                                <div key={item.label} className={signup.summaryRow}>
                                    <span className={signup.summaryLabel}>{item.label}</span>
                                    <span className={signup.summaryValue}>{item.value}</span>
                                </div>
                            )
                        })}
                    </div>
                    <A url="/login" className={signup.doneBtn}>로그인하러 가기</A>
                </div>
            </div>
        </>
    }

    return <>
        <form className={signup.box} onSubmit={handleSubmit} noValidate>
            <div className={signup.progress}>
                <div className={signup.progressHead}>
                    <span>회원가입</span>
                    <span className={signup.stepLabel}>{stepIndex + 1} / {steps.length}</span>
                </div>
                <div className={signup.bars}>
                    {steps.map((item, index) => {
                        return <div key={item.key} className={index <= stepIndex ? signup.barOn : signup.bar}></div>
                    })}
                </div>
            </div>
            <div className={signup.question}>
                <h1 className={signup.title}>{step.question}</h1>
                <p className={signup.help}>{step.help}</p>
            </div>
            <div className={signup.inputBox}>
                <input
                    key={step.key}
                    autoFocus
                    aria-label={step.label}
                    className={form.inputTall}
                    type={step.type}
                    inputMode={step.inputMode}
                    autoComplete={step.autoComplete}
                    placeholder={step.label}
                    value={value}
                    onChange={handleChange}
                />
                {error ? <span role="alert" className={signup.alarmText}>{error}</span> : <></>}
            </div>
            <div className={signup.actions}>
                <div className={signup.btnRow}>
                    {stepIndex > 0 ? <button type="button" className={form.secondaryBtnTall} onClick={handleBack}>이전</button> : <></>}
                    <button type="submit" disabled={isSubmitting} className={`${signup.nextBtn} ${value.trim().length > 0 && !isSubmitting ? "" : form.idle}`}>{isLast ? "가입하기" : "다음"}</button>
                </div>
                <div className={signup.loginText}>
                    이미 계정이 있나요? <A url="/login" className={signup.loginLink}>로그인</A>
                </div>
            </div>
        </form>
    </>
}
