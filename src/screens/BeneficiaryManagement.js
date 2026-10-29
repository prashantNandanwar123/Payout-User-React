import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addrRex, alphaRex, alphaSpaceRex, blankSpace, emailRex, fetchApi, fetchIfscApi, typeIfsc, typeNumber } from "../assets/customValidation";
import { Input, SelectInput, Label } from "../components/RHF";
import { useDispatch, useSelector } from "react-redux";
import { benefDataAction } from "../store/actions";
import Navbar, { NavbarLogo } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { dateInNumbersR } from "../assets/functions";
import { CheckInput } from "../components/MiniComps";
import ResellerNavbar from "../components/ResellerNavbar";

const BeneficiaryManagement = (props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [ifscState, setIfscState] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
    const dispatch = useDispatch();

    const [smtBenefBtn, setSmtBenefBtn] = useState(false);
    const [benefDataObj, setBenefDataObj] = useState(false);
    const [benefResCode, setBenefResCode] = useState(null);
    const [benefResMsg, setBenefResMsg] = useState('');
    const openBMRef = useRef(null);

    const benefData = useSelector(state => state.benefData);
    const itemsPerPage = 10;
    const searchData = benefData.data.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    // useEffect(()=>{
    //     console.log('heflsdkf')
    // },[])

    const addBeneficiary = async (data) => {
        // console.log(data)

        let dtUID = dateInNumbersR();
        let randNo = Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString().slice(-6);
        let requestId = 'PD'+dtUID+randNo;

        data.beneficiaryBankName = document.getElementById('benefbn').value;
        data.beneficiaryBankBranchName = document.getElementById('benefbbn').value;

        if (data.beneficiaryAccountNo !== data.cfmAcNo) {
            toast.error('A/c number is not matched', { toastId: 1 });
            return false;
        }
        if (ifscState) return false;
        setSmtBenefBtn(true)
        setBenefDataObj(data)
        // return false;
        // let [res, result] = await fetchApi('addBeneficiary', 'POST', { ...data, userId, requestId })
        let [res, result] = await fetchApi('addBeneficiaryApi', 'POST', { ...data, userId, requestId })
        // console.log(res)
        // console.log(result)
        if (res.status !== 200) {
            toast.error(res.statusText, { toastId: 1 })
        } else {
            if(result.respData){
                let data = JSON.parse(result.respData);
                // if (result.respCode === 0) {
                //     let data = JSON.parse(result.respData);
                //     toast.success(data.responseMsg, { toastId: 0 })
                //     setSmtBenefBtn(false)
                // } else {
                //     let data = JSON.parse(result.respData);
                //     toast.error(data.responseMsg, { toastId: 1 })
                //     setSmtBenefBtn(false)
                // }
                openBMRef.current.click();
                setBenefResCode(result.respCode)
                setBenefResMsg(data.responseMsg)
                setSmtBenefBtn(false)
                dispatch(benefDataAction(null,null))
                // reset();
            }
        }
    }

    const fetchIfscCode = async (e) => {
        let bankName = document.getElementById('benefbn');
        let bankBranch = document.getElementById('benefbbn');
        let ifscErr = document.querySelector('#' + e.target.id + '+strong');
        try {
            if (e.target.value.length === 11) {
                let [res,result] = await fetchIfscApi(e.target.value)
                let { ADDRESS, BANK } = result;
                if (res.status !== 200) {
                    ifscErr.textContent = 'Not Found';
                    setIfscState(true)
                } else {
                    bankName.value = BANK || 'Not Found';
                    bankBranch.value = ADDRESS || 'Not Found';
                    ifscErr.textContent = "";
                    setIfscState(false)
                }
            } else {
                bankName.value = ""
                bankBranch.value = ""
            }
        } catch (error) { console.log(error) }
    }

    const benefCheckFilter = (e) => {
        dispatch(benefDataAction(null,e.target.value))
    }

    // console.log(benefData)

    return (<>
        <section>
            <NavbarLogo />
            {/* <Navbar idx={3} logout={props.logout} title="BENEFICIARY MANAGEMENT" /> */}
            {props.isReseller ?<ResellerNavbar idx={3} logout={props.logout} title="BENEFICIARY MANAGEMENT"/>
                             : <Navbar idx={3} logout={props.logout} title="BENEFICIARY MANAGEMENT"/> } 

           
            <input type="hidden" data-bs-toggle="modal" data-bs-target="#benefModal" ref={openBMRef} />
            <form className="border p-4 my-4" id="addbeneform" onSubmit={handleSubmit(addBeneficiary)} autoComplete="off">
                <div className="row">
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefmode" name="Mode" req={true} />
                        <SelectInput register={register} req={true} option={["IMPS", "RTGS"]}
                            id="benefmode" name="transferMode" regex={alphaRex} onInput={blankSpace} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefname" name="Name" req={true} />
                        <Input register={register} req={true} id="benefname" name="beneficiaryName" errors={errors.beneficiaryName}
                            regex={alphaSpaceRex} onInput={blankSpace} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefemail" name="Email" req={true} />
                        <Input register={register} req={true} id="benefemail" name="beneficiaryEmail" 
                        errors={errors.beneficiaryEmail} regex={emailRex} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefmob" name="Mobile No" req={true} />
                        <Input register={register} req={true} id="benefmob" name="beneficiaryMobile" errors={errors.beneficiaryMobile}
                            regex={''} onInput={typeNumber} minLen={10} maxLen={10} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefAcType" name="Account Type" req={true} />
                        <SelectInput register={register} req={true} option={["SAVING", "CURRENT"]}
                            id="benefAcType" name="accountType" regex={alphaRex} onInput={blankSpace} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefacNo" name="Account No" req={true} />
                        <Input register={register} req={true} id="benefacNo" name="beneficiaryAccountNo" errors={errors.beneficiaryAccountNo}
                            regex={''} onInput={typeNumber} minLen={8} maxLen={17} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="cfmacno" name="Confirm Account No" req={true} />
                        <Input register={register} req={true} id="cfmacno" name="cfmAcNo" errors={errors.cfmAcNo}
                            regex={''} onInput={typeNumber} minLen={8} maxLen={17} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefifcs" name="Ifsc Code" req={true} />
                        <Input register={register} req={true} id="benefifcs" name="beneficiaryIfcsCode" errors={errors.beneficiaryIfcsCode}
                            regex={''} minLen={11} maxLen={11} onInput={(e) => { typeIfsc(e); fetchIfscCode(e) }} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefbn" name="Bank Name" req={true} />
                        <Input register={register} req={false} id="benefbn" name="beneficiaryBankName" css="cursor-not-allow"
                            regex={''} read="readonly" />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefbbn" name="Bank Branch Name" req={true} />
                        <Input register={register} req={false} id="benefbbn" name="beneficiaryBankBranchName" css="cursor-not-allow"
                            regex={''} read="readonly" />
                    </div>

                    {/* <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefifcs" name="Ifsc Code" req={true} />
                        <Input register={register} req={true} id="benefifcs" name="beneficiaryIfcsCode" errors={errors.beneficiaryIfcsCode}
                            regex={''} minLen={11} maxLen={11} onInput={typeIfsc} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefbn" name="Bank Name" req={true} />
                        <Input register={register} req={true} id="benefbn" name="beneficiaryBankName" regex={alphaSpaceRex} errors={errors.beneficiaryBankName} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefbbn" name="Bank Branch Address" req={true} />
                        <Input register={register} req={true} id="benefbbn" name="beneficiaryBankBranchName" regex={addrRex} errors={errors.beneficiaryBankBranchName} />
                    </div> */}

                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefaddr" name="Address" req={true} />
                        <Input register={register} req={true} id="benefaddr" name="beneficiaryAddress" errors={errors.beneficiaryAddress}
                            regex={addrRex} onInput={blankSpace} />
                    </div>
                    <div className="col-md-6 col-lg-4 mb-2">
                        <Label for="benefpin" name="Pincode" req={true} />
                        <Input register={register} req={true} id="benefpin" name="beneficiaryPincode" errors={errors.beneficiaryPincode}
                            regex={''} onInput={typeNumber} minLen={6} maxLen={6} />
                    </div>
                    <div className="col-12 mt-2 text-center">
                        {smtBenefBtn ? 
                        <button className="themebg2 btn text-white text-center" disabled>
                            <span className="spinner-border spinner-border-sm"></span> Add Beneficiary
                        </button> :
                        <button className="themebg2 btn text-white text-center" type="submit">Add Beneficiary</button>
                        }
                    </div>
                </div>
            </form>

            <ul className="list-group list-group-horizontal-md mb-3 mt-2 fts_filter">
                <li className="list-group-item">
                    <CheckInput id="bcfcheck2" val="Pending" label="PENDING" change={benefCheckFilter} />
                </li>
                <li className="list-group-item">
                    <CheckInput id="bcfcheck3" val="Rejected" label="REJECTED" change={benefCheckFilter} />
                </li>
            </ul>                    

            <PagiSearch setSearch={setSearch}
            totalEntries={searchData.length}
            setStartOffset={setStartOffset}
            setTableDataStatus={setTableDataStatus} />

            <div className="table-responsive my-2">
                <table className="table table-bordered payout-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Transfer Mode</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Ifsc Code</th>
                            <th>Bank Name</th>
                            <th>Bank Branch Address</th>
                            <th>Account No.</th>
                            <th>Pincode</th>
                            <th>Address</th>
                            <th>Varify Status</th>
                            <th>Description</th>
                            <th>Beneficiary Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length < 1 ? <tr><td colSpan={12}><h6>{tableDataStatus}</h6></td></tr> : 
                        currentItems.map((item,index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{startOffset + index + 1}</td>
                                    <td>{item.transferMode}</td>
                                    <td>{item.beneficiaryName}</td>
                                    <td>{item.beneficiaryEmail}</td>
                                    <td>{item.beneficiaryMobile}</td>
                                    <td>{item.beneficiaryIfcsCode}</td>
                                    <td>{item.beneficiaryBankName}</td>
                                    <td>{item.beneficiaryBankBranchName}</td>
                                    <td>{item.beneficiaryAccountNo}</td>
                                    <td>{item.beneficiaryPincode}</td>
                                    <td>{item.beneficiaryAddress}</td>
                                    <td>{item.verifyStatus}</td>
                                    <td>{item.responseMsg}</td>
                                    <td>{item.beneficiaryStatus}</td>
                                    <td>
                                        <button type="button" className="btn btn-sm text-danger border-0" onClick={()=>dispatch(benefDataAction(item.id,null))}>
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
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
        {/* <CustomAlert msg={alertMsg} /> */}

        {/* Model Start */}
        <div className="modal fade" id="benefModal" data-bs-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body p-4">
                        <div className={`border p-2 mb-2 text-center text-uppercase bg-light ${benefResCode===0?'text-success':'text-danger'}`}>
                            <strong>{benefResMsg || 'NO MESSAGE FOUND !!'}</strong>
                        </div>
                        <div className="d-flex border p-3">
                            <div className="me-3 pe-3 border-end">
                                <div className="mb-1"><small>MODE</small></div>
                                <div className="mb-1"><small>NAME</small></div>
                                <div className="mb-1"><small>ACCOUNT NO</small></div>
                                <div className="mb-1"><small>BANK NAME</small></div>
                            </div>	
                            <div>
                                <div className="mb-1 text-secondary"><strong>{benefDataObj.transferMode}</strong></div>
                                <div className="mb-1 text-secondary"><strong>{benefDataObj.beneficiaryName}</strong></div>
                                <div className="mb-1 text-secondary"><strong>{benefDataObj.beneficiaryAccountNo}</strong></div>
                                <div className="mb-1 text-secondary"><strong>{benefDataObj.beneficiaryBankName}</strong></div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-sm bg-secondary text-white w-100 mt-2" data-bs-dismiss="modal">CLOSE</button>
                    </div>
                </div>
            </div>
        </div>
        {/* Model End */}

    </>)
}

export default BeneficiaryManagement;

