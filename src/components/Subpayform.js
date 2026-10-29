import React from 'react'
import { useForm } from "react-hook-form";
import { Input, Label, SelectInput} from "./RHF";
import {  fetchApi, typeNumber, amtRex, alphaRex, generateOrderId } from "../assets/customValidation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
function Subpayform() {
    
const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    const { register, handleSubmit, formState: { errors } } = useForm();
    const fundData = useSelector(state => state.benefData);
    const [payForm, setPayForm] = useState({});



    const submitPayNow = async (data) => {
        const getOrderId = generateOrderId ()
        // console.log("generateOrderId--",generateOrderIds)
        // let { latitude, longitude } = JSON.parse(sessionStorage.getItem('userDetails'))
        if (document.getElementById('tranacNo').value !== document.getElementById('cfmAcNo').value) {
            toast.error('A/c number is not matched', { toastId: 1 });
            return false;
        }
        
        if(data.amount <= 150){
            toast.error('Amount should be greater than 150', { toastId: 1 })
            return false;
        }
        data.beneficiaryAccNo = document.getElementById('tranacNo').value;
        data.beneficiaryAddress = document.getElementById('tranaddr').value;
        data.beneficiaryBankName =document.getElementById('tranbankname').value;
        data.beneficiaryBranchAddress = document.getElementById('tranbankbranch').value;
        data.beneficiaryEmailAddress = document.getElementById('tranemail').value;
        data.beneficiaryIfscCode = document.getElementById('tranifsc').value;
        data.beneficiaryName = document.getElementById('tranname').value;
        data.beneficiaryMobileNo = document.getElementById('tranmob').value;
        data.beneficiaryPincode = document.getElementById('tranpin').value;
        data.transferType = document.getElementById('tranmode').value;
        data.merchantTrxnRefId = getOrderId;
        // console.log(latitude+' == '+longitude)
        // return false
        let loadId = toast.loading('Please wait transaction in process...')
        let [res,result] = await fetchApi('requestToPay','POST', {...data,userId:userDetails?.userId})
        if (res.status !== 200) {
            // toast.error(res.statusText, { toastId: 1 })
            toast.update(loadId,{render:res.statusText,type:"error",isLoading:false,autoClose:true});
        } else {
            if (result.respCode === 1) {
                // toast.error(result.respMsg, { toastId: 1 })
                toast.update(loadId,{render:result.respMsg,type:"error",isLoading:false,autoClose:true});
            } else {
                // toast.success(result.respMsg, { toastId: 0 })
                toast.update(loadId,{render:result.respMsg,type:"success",isLoading:false,autoClose:true});
                //document.getElementById('closebtn').click();
            }
        }
    }

  return (<>
    <form className="p-3" onSubmit={handleSubmit(submitPayNow)}>
                                <div className="row px-5">
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranmode" name="Mode" req={true} />
                                        <SelectInput register={register} req={true} val={payForm.transferMode||''} id="tranmode" name="transferType" 
                                        option={["NEFT", "IMPS"]} regex={alphaRex} />
                                    </div>
                                    {/* <div className="col-12 col-sm-6 mb-2">
                                        <Label for="tranmode" name="Mode" req={true} />
                                        <Input register={register} req={false}  id="tranmode" name="transferType" 
                                         regex={''}/> 
                                    </div> */}
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranname" name="Name" req={true} />
                                        <Input register={register} req={true}  id="tranname" name="beneficiaryName" 
                                         regex={''} /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranacNo" name="Account No" req={true} />
                                        <Input register={register} req={true}  id="tranacNo" name="beneficiaryAccNo" 
                                         regex={''}  minLen={8} maxLen={16}/>  
                                    </div>
                                    <div className="col-md-6 col-lg-4 mb-2">
                                    <Label for="cfmAcNo" name="Confirm Account No" req={true} />
                                    <Input register={register} req={true} id="cfmAcNo" name="cfmAcNo" 
                                        regex={''}  minLen={8} maxLen={16} />
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranifsc" name="Ifsc Code" req={true} />
                                        <Input register={register} req={true}  id="tranifsc" name="beneficiaryIfscCode" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranbankname" name="Bank Name" req={true} />
                                        <Input register={register} req={true}  id="tranbankname" name="beneficiaryBankName" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranbankbranch" name="Bank Branch Address" req={true} />
                                        <Input register={register} req={true}  id="tranbankbranch" name="beneficiaryBranchAddress" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranemail" name="Email Address" req={true} />
                                        <Input register={register} req={true}  id="tranemail" name="beneficiaryEmailAddress" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranmob" name="Mobile No" req={true} />
                                        <Input register={register} req={true}  id="tranmob" name="beneficiaryMobileNo" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranaddr" name="Address" req={true} />
                                        <Input register={register} req={true}  id="tranaddr" name="beneficiaryAddress" 
                                         regex={''}  /> 
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="fundamt" name="Amount" req={true} />
                                        <Input register={register} req={true} id="fundamt" name="amount" errors={errors.amount} 
                                        onInput={typeNumber} regex={amtRex} maxLen={10} />
                                    </div>
                                    <div className="col-12 col-sm-4 mb-2">
                                        <Label for="tranpin" name="pincode" req={true} />
                                        <Input register={register} req={true} id="tranpin" name="beneficiaryPincode" errors={errors.amount} 
                                        onInput={typeNumber} regex={amtRex} maxLen={6} />
                                    </div>
                                    {/* <div className="col-12  col-sm-6">
                                        <Label for="remark" name="Remark" req={true} />
                                        <Input register={register} req={true} id="remark" name="txnNote" regex={''} errors={errors.txnNote} onInput={stopTags} />
                                    </div> */}
    
                                    <div className="col-12  mt-4 d-flex justify-content-center">
                                        <button type="submit" className="btn text-white themebg2 mx-auto w-25 ">Pay Now</button>
                                    </div>
                                </div>
                            </form> 
  </>
  )
}

export default Subpayform