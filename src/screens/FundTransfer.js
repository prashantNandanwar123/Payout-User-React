import { useForm } from "react-hook-form";
import { Input, Label } from "../components/RHF";
import {  fetchApi, amtRex, typeFloatNumber, typeNumber, typeIfsc } from "../assets/customValidation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar, { NavbarLogo } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import Subpayform from "../components/Subpayform";
import ResellerNavbar from "../components/ResellerNavbar";

const FundTransfer = (props) => {

    const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
    const { register, handleSubmit, formState: { errors } } = useForm();
    const fundData = useSelector(state => state.benefData);
    const [payForm, setPayForm] = useState({});

    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');

    const itemsPerPage = 10;
    const searchData = fundData.data.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(()=>{
        //console.log(fundData)
        if(fundData.loading){
            setTableDataStatus('Loading...')
        }else{
            setTableDataStatus('Not Found')
        }
    },[fundData.loading])

    const payHandler = (id) => {
        let payRow = fundData.data.filter(item => item.id === id)
        setPayForm(payRow[0])
    }

    const submitPayNow = async (data) => {
        // console.log({...data,userId})
        // let { latitude, longitude } = JSON.parse(sessionStorage.getItem('userDetails'))
       
        if(data.amount <= 150){
            toast.error('Amount should be greater than 150', { toastId: 1 })
            return false;
        }
        data.beneficiaryAccNo = payForm.beneficiaryAccountNo;
        data.beneficiaryAddress = payForm.beneficiaryAddress;
        data.beneficiaryBankName = payForm.beneficiaryBankName;
        data.beneficiaryBranchAddress = payForm.beneficiaryBankBranchName;
        data.beneficiaryEmailAddress = payForm.beneficiaryEmail;
        data.beneficiaryIfscCode = payForm.beneficiaryIfcsCode;
        data.beneficiaryName = payForm.beneficiaryName;
        data.beneficiaryMobileNo = payForm.beneficiaryMobile;
        data.beneficiaryPincode = payForm.beneficiaryPincode;
        data.transferType = payForm.transferMode;
        

        // console.log(latitude+' == '+longitude)
        // return false
        let loadId = toast.loading('Please wait transaction in process...')
        let [res,result] = await fetchApi('requestToPay','POST', {...data,userId})
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
                // document.getElementById('closebtn').click();
            }
        }
    }

    //console.log(fundData)

    // return false;

    return (<>
        <section>
            <NavbarLogo />
            {props.isReseller ?<ResellerNavbar idx={4} logout={props.logout} title="FUND TRANSFER"  />
                             : <Navbar idx={4} logout={props.logout} title="FUND TRANSFER"  /> } 



            {/* <Navbar idx={4} logout={props.logout} title="FUND TRANSFER" /> */}
                <Subpayform/>
            <PagiSearch setSearch={setSearch}
            totalEntries={searchData.length}
            setStartOffset={setStartOffset}
            setTableDataStatus={setTableDataStatus} />

            <div className="table-responsive my-2">
                <table className="table table-bordered payout-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Name</th>
                            <th>Payment Mode</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Ifsc Code</th>
                            <th>Bank Name</th>
                            <th>Bank Branch Address</th>
                            <th>Account No.</th>
                            <th>Pincode</th>
                            <th>Address</th>
                            <th>Source</th>
                            <th>Varify Status</th>
                            <th>Beneficiary Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length < 1 ? <tr><td colSpan={12}><h6>{tableDataStatus}</h6></td></tr> :
                        currentItems.map((item,index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{index+1}</td>
                                    <td>{item.beneficiaryName}</td>
                                    <td>{item.transferMode}</td>
                                    <td>{item.beneficiaryEmail}</td>
                                    <td>{item.beneficiaryMobile}</td>
                                    <td>{item.beneficiaryIfcsCode}</td>
                                    <td>{item.beneficiaryBankName}</td>
                                    <td>{item.beneficiaryBankBranchName}</td>
                                    <td>{item.beneficiaryAccountNo}</td>
                                    <td>{item.beneficiaryPincode}</td>
                                    <td>{item.beneficiaryAddress}</td>
                                    <td>{item.source}</td>
                                    <td>{item.verifyStatus}</td>
                                    <td>{item.beneficiaryStatus}</td>
                                    <td>
                                        <button type="button" className="btn btn-sm border-0 text-white themebg2" data-bs-toggle="modal" data-bs-target="#payModal" onClick={()=>payHandler(item.id)}>PAY</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <PagiPageCount setStartOffset={setStartOffset}
            pageCount={pageCount} itemsPerPage={itemsPerPage} />
        </section>

        {/* Model Start */}
        <div className="modal fade" id="payModal" data-bs-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-body">
                        
                        <form className="p-3" onSubmit={handleSubmit(submitPayNow)}>
                            <div className="row">
                                {/* <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranmode" name="Mode" req={true} />
                                    <SelectInput register={register} req={false} val={payForm.transferMode||''} id="tranmode" name="transferType" 
                                    option={["NEFT", "IMPS"]} regex={alphaRex} />
                                </div> */}
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranmode" name="Mode" req={true} />
                                    {/* <h1>abc</h1> */}
                                    <Input register={register} req={false} val={payForm.transferMode||''} id="tranmode" name="transferType" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranname" name="Name" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryName||''} id="tranname" name="beneficiaryName" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranacNo" name="Account No" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryAccountNo||''} id="tranacNo" name="beneficiaryAccNo" 
                                    css="cursor-not-allow" regex={''} read="readonly" />  
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranifsc" name="Ifsc Code" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryIfcsCode||''} id="tranifsc" name="beneficiaryIfscCode" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranbankname" name="Bank Name" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryBankName||''} id="tranbankname" name="beneficiaryBankName" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranbankbranch" name="Bank Branch Address" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryBankBranchName||''} id="tranbankbranch" name="beneficiaryBranchAddress" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranemail" name="Email Address" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryEmail||''} id="tranemail" name="beneficiaryEmailAddress" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranmob" name="Mobile No" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryMobile||''} id="tranmob" name="beneficiaryMobileNo" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="tranaddr" name="Address" req={true} />
                                    <Input register={register} req={false} val={payForm.beneficiaryAddress||''} id="tranaddr" name="beneficiaryAddress" 
                                    css="cursor-not-allow" regex={''} read="readonly" /> 
                                </div>
                                <div className="col-12 col-sm-6 mb-2">
                                    <Label for="fundamt" name="Amount" req={true} />
                                    <Input register={register} req={true} id="fundamt" name="amount" errors={errors.amount} 
                                    onInput={typeFloatNumber} regex={amtRex} maxLen={10} />
                                </div>
                                {/* <div className="col-12">
                                    <Label for="remark" name="Remark" req={true} />
                                    <TextArea register={register} req={true} id="remark" name="txnNote" regex={''} errors={errors.txnNote} onInput={stopTags} />
                                </div> */}

                                <div className="mt-4 d-flex">
                                    <button type="button" className="btn btn-secondary mx-2 w-100" id="closebtn" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn text-white themebg2 mx-2 w-100" data-bs-dismiss="modal">Pay Now</button>
                                </div>
                            </div>
                        </form>
                       
                    </div>

                </div>
            </div>
        </div>
        {/* Model End */}

    </>)
}

export default FundTransfer;