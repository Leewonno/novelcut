import SingupBox from '../organism/SignupBox'
import signup from "../css/signup.module.css"

export default function NewSignup() {

  return <>
    <main className={signup.main}>
      <SingupBox />
    </main>
  </>
}
