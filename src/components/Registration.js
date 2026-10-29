import { useState } from "react";
import { useForm } from "react-hook-form";
import { addrRex, alphaNumRex, alphaRex, alphaSpaceRex, blankSpace, emailRex, fetchApi, fetchFileApi, fetchIfscApi, spaceStopTags, typeIfsc, typeNumber, upperCaseCvt } from "../assets/customValidation";
import { CountDown } from "./MiniComps";
import { Label, Input, OTPInput, FileInput, RadioInput, SelectInput, InputPswd } from "./RHF";
import { toast } from 'react-toastify';

const Registration = (props) => {
    //"proxy": "http://192.168.0.133:8091"
 
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isNext, setIsNext] = useState(false);
    const [otpReset, setOtpReset] = useState(false);
    const [moreFields, setMoreFields] = useState(false);
    const [userIdField, setUserIdField] = useState(false);
    const [ifscState, setIfscState] = useState(false);
    const [isOTPField, setIsOTPField] = useState(false);


    // const signupSubmit = async (data) => { 
    //     let {mobileNo,emailId,firstName,lastName,address,companyName,companyAddress,panNo,
    //         adharNo,panDocument,adharDocument,city,gender,merchantBankAccountNumber,
    //         merchantBankIfsc,merchantBankName,pincode,state,otp1,otp2,otp3,otp4} = data;
    //     let formData = new FormData();
    //     let otp = otp1+otp2+otp3+otp4;
    //     if(!moreFields){
    //         if (!isNext) {
    //             // commonOtpSendFunc();
    //             setIsNext(true)
    //         }else {
    //             let [res,result] = await fetchApi('OtpVerificationForSignup','POST', {...data,otp:otp})
    //             if(res.status !== 200){
    //                 toast.error(res.statusText, {toastId:1})
    //             }else{
    //                 if(result.respCode === 1){
    //                     toast.error(result.respMsg, {toastId:1})
    //                 }else{
    //                     toast.success(result.respMsg, {toastId:0})
    //                     setIsNext(false)
    //                     setMoreFields(true)
    //                     setUserIdField(true)
    //                 }
    //             }
    //         }
    //     }else{
    //         formData.append("mobileNo", mobileNo)
    //         formData.append("firstName", firstName)
    //         formData.append("lastName", lastName)
    //         formData.append("address", address)
    //         formData.append("companyName", companyName)
    //         formData.append("companyAddress", companyAddress)
    //         formData.append("panNo", panNo)
    //         formData.append("adharNo", adharNo)
    //         formData.append("emailId", emailId)
    //         formData.append("city", city)
    //         formData.append("gender", gender)
    //         formData.append("merchantBankAccountNumber", merchantBankAccountNumber)
    //         formData.append("merchantBankIfsc", merchantBankIfsc)
    //         formData.append("merchantBankName", merchantBankName)
    //         formData.append("pincode", pincode)
    //         formData.append("state", state)
    //         formData.append("document", panDocument[0])
    //         formData.append("document", adharDocument[0])
            
    //         if (!ifscState) return false;

    //         let [res,result] = await fetchFileApi('SubmitSignUp', formData)
    //         if(res.status !== 200){
    //             toast.error('Something went wrong', {toastId:1})
    //         }else{
    //             if(result.respCode === 1){
    //                 toast.error(result.respMsg, {toastId:1})
    //             }else{
    //                 toast.success(result.respMsg, {toastId:0})
    //                 //console.log('successfully submited !!')
    //                 props.formBool(false)
    //             }
    //         }
    //     }
    // }

    const signupSubmit = async (data) => { 
        let {mobileNo,emailId,firstName,lastName,address,companyName,companyAddress,panNo,
            adharNo,panDocument,adharDocument,city,gender,merchantBankAccountNumber,
            merchantBankIfsc,merchantBankName,pincode,state,otp1,otp2,otp3,otp4,password} = data;
        let formData = new FormData();
        let otp = otp1+otp2+otp3+otp4 || password;
        if(!moreFields){
            if (!isNext) {
                // commonOtpSendFunc();
                setIsNext(true)
            }else {
                // console.log({...data,otp:otp})
                // return false;
                let [res,result] = await fetchApi(`${!isOTPField?'passwordCreationForSignup':
                    'OtpVerificationForSignup'}`,'POST', {...data,otp:otp})
                // console.log(res)
                // console.log(result)
                if(res.status !== 200){
                    toast.error(res.statusText, {toastId:1})
                }else{
                    if(result.respCode === 1){
                        toast.error(result.respMsg, {toastId:1})
                    }else{
                        toast.success(result.respMsg, {toastId:0})
                        setIsNext(false)
                        setIsOTPField(false)
                        setMoreFields(true)
                        setUserIdField(true)
                    }
                }
            }
        }else{
            formData.append("mobileNo", mobileNo)
            formData.append("firstName", firstName)
            formData.append("lastName", lastName)
            formData.append("address", address)
            formData.append("companyName", companyName)
            formData.append("companyAddress", companyAddress)
            formData.append("panNo", panNo)
            formData.append("adharNo", adharNo)
            formData.append("emailId", emailId)
            formData.append("city", city)
            formData.append("gender", gender)
            formData.append("merchantBankAccountNumber", merchantBankAccountNumber)
            formData.append("merchantBankIfsc", merchantBankIfsc)
            formData.append("merchantBankName", merchantBankName)
            formData.append("pincode", pincode)
            formData.append("state", state)
            formData.append("document", panDocument[0])
            formData.append("document", adharDocument[0])
            
            if (!ifscState) return false;

            let [res,result] = await fetchFileApi('SubmitSignUp', formData)
            if(res.status !== 200){
                toast.error('Something went wrong', {toastId:1})
            }else{
                if(result.respCode === 1){
                    toast.error(result.respMsg, {toastId:1})
                }else{
                    toast.success(result.respMsg, {toastId:0})
                    //console.log('successfully submited !!')
                    props.formBool(false)
                }
            }
        }
    }
    
    const validateIFSC = async (e) => {
        if (e.target.value.length === 11) {
            let bankName = document.getElementById('meBankName').value;
            let ifscErr = document.querySelector('#' + e.target.id + '+strong');
            let [res,result] = await fetchIfscApi(e.target.value)
            if(result === 'Not Found'){
                ifscErr.textContent = "Not Found";
                setIfscState(false)
            }else{
                if(result.BANK!==bankName){
                    ifscErr.textContent = "Not match with their bank"
                    setIfscState(false)
                }else{
                    setIfscState(true)
                }
            }
        }
    }

    const validateBank = () => {
        let ifscElem = document.getElementById('mebankifsc');
        ifscElem.parentElement.querySelector('.inpErr').textContent = "";
        ifscElem.value = "";
        ifscElem.focus();
    }

    const commonOtpSendFunc = async () => {
        let mobileNo = document.getElementById('mobileno').value;
        let emailId = document.getElementById('emailid').value;
        let [res,result] = await fetchApi('OtpCreationForSignup','POST', {mobileNo,emailId})
        if(res.status !== 200){
            toast.error(res.statusText, {toastId:1})
        }else{
            if(result.respCode === 1){
                toast.error(result.respMsg, {toastId:1})
            }else{
                toast.success(result.respMsg, {toastId:0})
                setIsNext(true)
                setUserIdField(true)
                setOtpReset(!otpReset)
            }
        }
    }

    const checkOTPHandler = (e) => {
        // console.log(e.target.checked)
        if(e.target.checked){
            setIsOTPField(true)
            commonOtpSendFunc();
        }else{
            setIsOTPField(false)
        }
    }

    return (<>
        <form className="registerform border p-5 shadow rounded bg-white" style={!moreFields ? { width: '400px', height: 'auto' } : { width: '520px', height: '520px' }}
            onSubmit={handleSubmit(signupSubmit)} autoComplete="off">
            <div className="row">
                <div className="col-12 mb-2">
                    <h5 className="fw-bold logintitle">REGISTRATION TO PAYOUT</h5>
                </div>
                <div className="col-12 mb-2">
                    <Label for="mobileno" name={!isNext?'What’s your mobile number?':'Your mobile number is:'} req={true} />
                    <Input css={userIdField?'cursor-not-allow':''} register={register} req={true} id="mobileno" name="mobileNo" errors={errors.mobileNo} 
                    focus={true} regex={''} read={userIdField?'readonly':''} minLen={10} maxLen={10} onInput={typeNumber} />
                </div>
                <div className="col-12 mb-2">
                    <Label for="emailid" name="Email Address" req={true} />
                    <Input register={register} id="emailid" name="emailId" css={userIdField?'cursor-not-allow':''} 
                    read={userIdField?'readonly':''} req={true} errors={errors.emailId} regex={emailRex} />
                    {isOTPField ? <small role="button" className="text-secondary entrymodelink float-end" onClick={commonOtpSendFunc}>Resend</small> : ''}
                </div>

                {isNext ?

                    (!isOTPField ? 
                        <div className="col-12">
                            <Label for="createpswd" name="Enter Password" req={true} />
                            <InputPswd register={register} req={true} id="createpswd" name="password" 
                            minLen={8} maxLen={50} errors={errors.password} regex={''} onInput={spaceStopTags} />
                        </div>
                        :
                        <div className="col-12 mb-2"> 
                            <Label for="eorm" name="Enter OTP" req={true} />
                            <strong>
                                <small className="text-secondary ms-1">
                                <CountDown minutes={4} seconds={60} reSend={setIsNext} otpReset={otpReset} />
                                </small>
                            </strong>
                            <div className="d-flex">
                                <OTPInput register={register} otpBox={4} />
                            </div>
                        </div> 
                    )
                : ''}
                
                {moreFields ?
                    <>
                        <div className="col-lg-6 mb-2">
                            <Label for="firstname" name="First Name" req={true} />
                            <Input register={register} req={true} id="firstname" name="firstName" 
                            errors={errors.firstName} focus={true} regex={alphaRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="lastname" name="Last Name" req={true} />
                            <Input register={register} req={true} id="lastname" name="lastName" 
                            errors={errors.lastName} regex={alphaRex} onInput={blankSpace} />
                        </div>
                        <div className="col-12 mb-2">
                            <Label for="address" name="Address" req={true} />
                            <Input register={register} req={true} id="address" name="address" 
                            errors={errors.address} regex={addrRex} onInput={blankSpace} />
                        </div>

                        <div className="col-lg-6 mb-2">
                            <Label for="city" name="City" req={true} />
                            <Input register={register} req={true} id="city" name="city" 
                            errors={errors.city} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="state" name="State" req={true} />
                            <Input register={register} req={true} id="state" name="state" 
                            errors={errors.state} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="zipcode" name="Pincode" req={true} />
                            <Input register={register} req={true} id="zipcode" name="pincode" 
                            errors={errors.pincode} regex={''} onInput={typeNumber} minLen={6} maxLen={6} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="meBankAccNo" name="Merchant Bank Account" req={true} />
                            <Input register={register} req={true} id="meBankAccNo" name="merchantBankAccountNumber" 
                            errors={errors.merchantBankAccountNumber} regex={''} onInput={typeNumber} minLen={8} maxLen={17} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="meBankName" name="Merchant Bank Name" req={true} />
                            <SelectInput register={register} option={["ICICI Bank","RBL Bank","Yes Bank","Axis Bank","HDFC Bank","Punjab National Bank","Bandhan Bank","AU Small Finance Bank","IDBI","Indusind Bank","Punjab & Sind Bank","Bank of Baroda","Bank of India","IDFC FIRST Bank","State Bank of India","Indian Overseas Bank","Indian Bank","Federal Bank","Kotak Mahindra Bank"]}
                            req={true} id="meBankName" name="merchantBankName" regex={''} onInput={validateBank} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="mebankifsc" name="Merchant Bank Ifsc" req={true} />
                            <Input register={register} req={true} id="mebankifsc" name="merchantBankIfsc" errors={errors.merchantBankIfsc} regex={''}
                            minLen={11} maxLen={11} onInput={(e) => { typeIfsc(e); validateIFSC(e) }} />
                        </div>
                        <div className="col-12 mb-2">
                            <Label for="coname" name="Company Name" req={true} />
                            <Input register={register} req={true} id="coname" name="companyName" errors={errors.companyName} regex={alphaSpaceRex} onInput={blankSpace} />
                        </div>
                        <div className="col-12 mb-2">
                            <Label for="coaddr" name="Company Address" req={true} />
                            <Input register={register} req={true} id="coaddr" name="companyAddress" errors={errors.companyAddress} regex={addrRex} onInput={blankSpace} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="panno" name="Pan Card No." req={true} />
                            <Input register={register} req={true} id="panno" name="panNo" errors={errors.panNo} regex={alphaNumRex} minLen={10} maxLen={10} onInput={upperCaseCvt} />
                        </div>
                        <div className="col-lg-6 mb-2">
                            <Label for="adharno" name="Aadhar Card No." req={true} />
                            <Input register={register} req={true} id="adharno" name="adharNo" errors={errors.adharNo} regex={''} onInput={typeNumber} minLen={12} maxLen={12} />
                        </div>
                        {/* <div className="col-12 mb-2">
                            <Label for="emailid" name="Email Address" req={true} />
                            <Input register={register} req={true} id="emailid" name="emailId" errors={errors.emailId} regex={emailRex} />
                        </div> */}
                        <div className="col-12 mb-2">
                            <Label name="Gender" req={true} />
                            <div>
                                <RadioInput register={register} radioName="Male" val="Male" name="gender" id="male" checked={true} />
                                <RadioInput register={register} radioName="Female" val="Female" name="gender" id="female" checked={false} />
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <Label for="adhardoc" name="Upload Pan Card" req={true} />
                            <FileInput register={register} req={true} id="adhardoc" name="adharDocument" errors={errors.adharDocument} />
                        </div>
                        <div className="col-12 mb-2">
                            <Label for="pandoc" name="Upload Aadhar Card" req={true} />
                            <FileInput register={register} req={true} id="pandoc" name="panDocument" errors={errors.panDocument} />
                        </div>
                    </>
                    : ''}

                <div className="col-12 mt-2">
                    {moreFields ? <button type="submit" className="btn text-white themebg2 w-100">REGISTRATION</button>
                    :<>
                        {/* <button type="submit" className="btn text-white themebg2 w-100">{!isNext ? 'Next' : 'VERIFY OTP'}</button>} */}
                        {isNext ?
                        <div className="form-check mb-2">
                            <input className="form-check-input shadow-none" type="checkbox" id="otpcheck" role="button" onChange={checkOTPHandler} />
                            <label className="form-check-label fw-bold text-secondary form_label" htmlFor="otpcheck" role="button">SIGNUP WITH OTP</label>
                        </div>
                        : ''}
                        <button type="submit" className="btn text-white themebg2 w-100">{!isNext ? 'Next' : (!isOTPField?'CREATE PASSWORD':'VERIFY OTP')}</button>
                    </> }
                </div>
                <div className="col-12 text-end mt-2">
                    <span role="button" className="text-secondary entrymodelink" onClick={() => props.formBool(false)}>Already have an account ?</span>
                </div>
            </div>
        </form>
    </>)
}

export default Registration;