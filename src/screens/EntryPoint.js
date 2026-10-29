import { useState } from "react";
import otpImg from "../assets/images/otp.jpg";
// import logo from "../assets/images/logo.png";
import Login from "../components/Login";
import Registration from "../components/Registration";

//   "proxy": "http://localhost:8080/"

const EntryPoint = (props) => {
    const [isForm, setIsForm] = useState(false);

    // const dateAry = ['2024/06/14','2024/06/12','2024/06/04','2023/06/14']
    // const newDate = dateAry.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    // console.log(newDate)

    //console.log(new Date('2023/06/14'))

    return (<>
        <div className="container-fluid entrypoint">
            <div className="row vh-100">
                <div className="col-md-6 d-flex align-items-center border-end">
                    <img src={otpImg} alt="Loading.." width="100%" />
                    {/* <img src={logo} className="login-logo" alt="Loading.." /> */}
                </div>
                <div className="col-md-6 right-side">
                    <div className="h-100 d-flex justify-content-center align-items-center">
                        {!isForm ? <Login formBool={setIsForm} userExist={props.userExist}  setIsReseller={props.setIsReseller} isReseller={props.isReseller}/> : 
                        <Registration formBool={setIsForm} />}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default EntryPoint;