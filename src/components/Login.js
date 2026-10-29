import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fetchApi, spaceStopTags, typeNumber,blankSpace,stopTags, } from "../assets/customValidation";
import { CountDown } from "./MiniComps";
import { Label, Input, OTPInput, InputPswd ,InputPsd} from "./RHF";

const Login = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register:register2, handleSubmit:handleSubmit2, formState: { errors:errors2 } } = useForm();
    // console.log("props.issReseller",props.isReseller)
    const [isNext, setIsNext] = useState(false);
    const [otpReset, setOtpReset] = useState(false);
    const [isOTPField, setIsOTPField] = useState(false);
    // const [userLocation, setUserLocation] = useState();
    
    const loginSubmit = async (data) => {
        // console.log(data)
        let { otp1, otp2, otp3, otp4, password } = data;
        let otp = otp1 + otp2 + otp3 + otp4 || password;
        if (!isNext) {
            // commonOtpSendFunc()
            setIsNext(true)
        }else {
           
            let [res,result] = await fetchApi(`${!isOTPField?'passwordVerificationForSignin':
                    'OtpVerificationForSignin'}`,'POST', {...data,otp:otp})
            // console.log(res)
            // console.log(result)
            if(res.status !== 200){
                toast.error(res.statusText, {toastId:1})
            }else{
                if(result.respCode === 1){
                    toast.error(result.respMsg, {toastId:1})
                }else{
                    // if(navigator.geolocation){
                    //     navigator.geolocation.getCurrentPosition((position)=>{
                    //         let { latitude, longitude } = position.coords;
                    //         let userData = result.respData;
                    //         sessionStorage.setItem('userDetails',JSON.stringify({...userData,latitude,longitude}));
                    //         props.userExist(true) 
                    //         toast.success(result.respMsg, {toastId:0})
                    //     })
                    // }else{
                    //     toast.error('Your device is not supported Geolocation', {toastId:1})
                    // }
                    sessionStorage.setItem('userDetails',JSON.stringify(result.respData));
                    props.userExist(true) 
                    props.setIsReseller(false)
                    // toast.success(result.respMsg, {toastId:0})
                }
            }
        }
    }

    const commonOtpSendFunc = async () => {
        let mobileNo = document.getElementById('mobileno').value;
        let [res,result] = await fetchApi('OtpCreationForSignin','POST', {mobileNo})
        if(res.status !== 200){
            toast.error(res.statusText, {toastId:1})
        }else{
            if(result.respCode === 1){
                toast.error(result.respMsg, {toastId:1})
            }else{
                toast.success(result.respMsg, {toastId:0})
                setIsNext(true)
                setOtpReset(!otpReset)
            }
        }
    }

    const checkOTPHandler = (e) => {
        if(e.target.checked){
            setIsOTPField(true)
            commonOtpSendFunc();
        }else{
            setIsOTPField(false)
        }
    }

    const resellerLoginSubmit = async (data) => {
        //console.log(data)
        try {
            let [res,result] = await fetchApi('resellerLogin','POST', data)
            // console.log(res)
            // console.log(result)
            if(res.status !== 200){
                toast.error('Something went wrong.', {toastId:1})
            }else{
                if(result.respCode === 1){
                    toast.error('Invalid Credentials', {toastId:1})
                }else{
                    sessionStorage.setItem('reUserDetails',JSON.stringify(result.respData));
                    props.userExist(true) 
                    props.setIsReseller(true)
                    toast.success('Welcome To Reseller Portal', {toastId:0})
                    // console.log("session-->",sessionStorage.getItem('reUserDetails'))
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // return (
    //     <form className="loginform border p-5 shadow rounded bg-white" onSubmit={handleSubmit(loginSubmit)} autoComplete="off">
    //         <div className="row">
    //             <div className="col-12 mb-2">
    //                 <h5 className="fw-bold logintitle">LOGIN TO PAYOUT</h5>
    //             </div>
    //             <div className="col-12 mb-3">
    //                 <Label for="mobileno" name={!isNext?'What’s your mobile number':'Your mobile number is:'} req={true} />
    //                 <Input css={isNext?'cursor-not-allow':''} register={register} req={true} name="mobileNo" id="mobileno"
    //                 errors={errors.mobileNo} focus={true} regex={''} read={isNext?'readonly':''}  minLen={10} maxLen={10} onInput={typeNumber} />
                    
    //                 {isOTPField ? <small role="button" className="text-secondary entrymodelink float-end" onClick={commonOtpSendFunc}>Resend</small> : ''}
                
    //             </div>
    //             {isNext ?
    //                 (!isOTPField ? 
    //                     <div className="col-12 mb-3">
    //                         <Label for="lpswd" name="Enter Password" req={true} />
    //                         <InputPswd register={register} req={true} id="lpswd" name="password" errors={errors.password} 
    //                         minLen={8} maxLen={50} regex={''} onInput={spaceStopTags} />
    //                     </div>
    //                     :
    //                     <div className="col-12 mb-3">
    //                         <Label for="eorm" name="Enter OTP" req={true} />
    //                         <strong>
    //                             <small className="text-secondary ms-1">
    //                                 <CountDown minutes={4} seconds={60} reSend={setIsNext} otpReset={otpReset} />
    //                             </small>
    //                         </strong>
    //                         <div className="d-flex">
    //                             <OTPInput register={register} otpBox={4} />
    //                         </div>
    //                     </div>
    //                 )
    //             : ''}

    //             {isNext ?
    //                 <div className="col-12">
    //                     <div className="form-check mb-2">
    //                         <input className="form-check-input shadow-none" type="checkbox" id="otpcheck" role="button" onChange={checkOTPHandler} />
    //                         <label className="form-check-label fw-bold text-secondary form_label" htmlFor="otpcheck" role="button">LOGIN WITH OTP</label>
    //                     </div>
    //                 </div>
    //             : ''}
    //             <div className="col-12 text-center">
    //                 <button type="submit" className="btn text-white themebg2 w-100">{!isNext ? 'Next' : 'Login'}</button>
    //             </div>

    //             <div className="col-12 text-end mt-2">
    //                 <span role="button" className="text-secondary entrymodelink" onClick={() => props.formBool(true)}>Create an account ?</span>
    //             </div>
    //         </div>
    //     </form>
    // )


//cahnge


  return (
    <div className="border p-5 shadow rounded bg-white" style={{width:"370px"}}>
      <div className="row ">
                <div className="col-12 mb-2">
                    <h5 className="fw-bold logintitle">LOGIN TO PAYOUT</h5>
                </div>

                <ul className="nav nav-tabs border-0 login-tabs mb-3">
                    <li className="nav-item position-relative">
                        <a className="nav-link active border-0" data-bs-toggle="tab" href="#melogintab">Merchant</a>
                    </li>
                    <li className="nav-item position-relative">
                        <a className="nav-link border-0" data-bs-toggle="tab" href="#relogintab">Reseller</a>
                    </li>
                </ul>
                <div className="tab-content px-0">
                    <div className="tab-pane active" id="melogintab">
                        <form onSubmit={handleSubmit(loginSubmit)} autoComplete="off">
                            <div className="col-12 mb-3">
                                <Label for="mobileno" name={!isNext?'What’s your mobile no ?':'Your mobile no is :'} req={true} />
                                <Input css={isNext?'cursor-not-allow':''} register={register} req={true} name="mobileNo" id="mobileno"
                                errors={errors.mobileNo} focus={true} regex={''} read={isNext?'readonly':''}  minLen={10} maxLen={10} onInput={typeNumber} />                
                            </div>
                            {isNext ?
                            <div className="col-12 mb-3">
                            <Label for="otp" name="Enter password" req={true} />
                            <InputPswd register={register} req={true} id="lpswd" name="password" errors={errors.password} 
                            minLen={8} maxLen={50} regex={''} onInput={spaceStopTags} />
                            </div>
                            : ''}
                            <div className="col-12 text-center">
                                <button type="submit" className="btn text-white themebg2 w-100">{!isNext ? 'Next' : 'Login'}</button>
                            </div>
                            <div className="col-12 text-end mt-2 d-flex justify-content-between">
                                <span role="button" className="text-secondary entrymodelink text-primary" onClick={()=>props.ShowForgetPassPage()}>Forget Password?</span>
                                <span role="button" className="text-secondary entrymodelink " onClick={() => props.formBool(true)}>Create an account ?</span>
                            </div>
                        </form>
                    </div>
                    <div className="tab-pane fade" id="relogintab">
                        <form onSubmit={handleSubmit2(resellerLoginSubmit)} autoComplete="off">
                            <div className="mb-2">
                                <Label for="reuserid" name="What’s Your User Id ?" req={true} />
                                <Input register={register2} req={true} id="reuserid" name="userId" errors={errors2.userId} regex={''} />
                            </div>
                            <div className="mb-2">
                                <Label for="repswd" name="Enter Password" req={true} />
                                <InputPsd register={register2} req={true} id="repswd" name="password" errors={errors2.password} regex={''} />
                            </div>
                            <button type="submit" className="btn text-white themebg2 w-100 mt-2">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default Login;

// http://192.168.0.123:8092/