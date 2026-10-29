import { useDispatch, useSelector } from "react-redux";
import Navbar, { NavbarLogo } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { PagiPageCount, PagiSearch, SortTableHeader } from "../components/PaginateTable";
import { DateInput } from "../components/MiniComps";
import { transferStatusAction } from "../store/actions";
import * as XLSX from "xlsx";
import { dateInNumbers, uploadValidFile } from "../assets/functions";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fetchApi } from "../assets/customValidation";
import ResellerNavbar from "../components/ResellerNavbar";

const BulkFundTransfer = (props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [bulkFundData, setBulkFundData] = useState([]);
    // const [dataFilter, setDataFilter] = useState([]);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const [smtSendBtn, setSmtSendBtn] = useState(false);
    const [revBtn, setRevBtn] = useState(false);
    const [bulkFTMsg, setBulkFTMsg] = useState(null);
    const [bulkFTStatus, setBulkFTStatus] = useState(false);

    const dispatch = useDispatch();
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    // const transferStatusData = useSelector(state => state.benefData);
    const itemsPerPage = 10;
    const searchData = bulkFundData.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    // useEffect(() => {
    //     //console.log(transferStatusData)
    //     if (transferStatusData.loading) {
    //         setTableDataStatus('Loading...')
    //     } else {
    //         setTableDataStatus('Not Found')
    //     }
    // }, [transferStatusData.loading])

    const sendFile = async (data) => {
        let file = data.file[0];
        let formData = new FormData();
        formData.append("file",file)
        setSmtSendBtn(true)
        setTableDataStatus('Loading...')
        setBulkFTMsg(null)
        try {
            // let res = await fetch('api/Admin/upload',{method:'POST',body:formData})
            let res = await fetch('api/bulkPayoutExcel',{method:'POST',body:formData})
            let result = await res.json();
            // console.log(res)
            // console.log(result)

            setSmtSendBtn(false)
            if(res.status !== 200){
                toast.error('Something went wrong', {toastId:1})
            }else{
                if(result.respCode===0 && result.respData && result.respData.length>0){
                    setBulkFundData(result.respData)
                    setBulkFTStatus(true)
                    setRevBtn(true)
                    setBulkFTMsg(result.respMsg)
                    reset()
                }else if(result.respCode===1 && result.respData && result.respData.length>0){
                    setBulkFundData(result.respData)
                    setBulkFTStatus(false)
                    setRevBtn(false)
                    setBulkFTMsg(result.respMsg)
                }else{
                    setTableDataStatus('Not Found')
                    toast.error(result.respMsg, {toastId:1})
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    const proceedToPay = async () => {
        // console.log(searchData)
        // return false;
        setBulkFundData([])
        setTableDataStatus('Loading...')
        setRevBtn(false)
        setBulkFTMsg(null)
        let loadId = toast.loading('Please wait payout in process...')
        let [res, result] = await fetchApi('requestToBulkPayout', 'POST', searchData)
        // console.log(res)
        // console.log(result)
        if(res.status !== 200){
            toast.error('Something went wrong :', {toastId:1})
        }else{
            if(result.respCode === 0){
                toast.update(loadId,{render:result.respMsg,type:"success",isLoading:false,autoClose:true});
            }else{
                toast.update(loadId,{render:result.respMsg,type:"error",isLoading:false,autoClose:true});
            }
            setTableDataStatus('Not Found !!')
        }
    }

    return (<>
        <section>
            
            <NavbarLogo />

            {props.isReseller ?<ResellerNavbar idx={6} logout={props.logout} title="BULK PAYMENTS" />
                             : <Navbar idx={6} logout={props.logout} title="BULK PAYMENTS" /> } 

            
            {/* <Navbar idx={6} logout={props.logout} title="BULK PAYMENTS" /> */}

            {/* <form className="mb-2" onSubmit={searchDataByDate}>
                <div className="row">
                    <div className="col-md-4 col-lg-2 mb-2">
                        <DateInput dateRef={fromDateRef} />
                    </div>
                    <div className="col-md-3 col-lg-2 mb-2">
                        <DateInput dateRef={toDateRef} />
                    </div>
                    <div className="col-md-3 col-lg-8 mb-2">
                        <div className="d-flex">
                            <button type="submit" className="btn btn-sm border-0 text-white themebg2 me-2">Search</button>
                            <button type="button" className="btn btn-sm border-0 text-white themebg2" onClick={exportToDownloadReport}>
                            Report <i className="bi bi-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form> */}
            
            {bulkFTMsg ? 
            <div className={`alert text-white rounded-0 ${bulkFTStatus ? 'bgsuccess' : 'bgerr'} py-2`}>
                <p className="mb-0">{bulkFTMsg}</p>
            </div> : ''}

            <form className="revfile-form mb-3" onSubmit={handleSubmit(sendFile)}>
                <div className="d-sm-flex">
                    <div className="inp-box me-2">
                        <label htmlFor="formFile" className="form-label fw-bold text-secondary">
                            <small>PLEASE UPLOAD PAYOUT (EXCEL) FILE</small>
                            <span className="text-danger fw-bold"> *</span>
                        </label>
                        <input className="form-control form-control-sm shadow-none" type="file" id="formFile" onInput={uploadValidFile}
                            {...register('file', { required: { value: true, message: 'This is a required field' } })} />
                        <strong className="text-danger inpErr">{errors.file && errors.file.message}</strong>
                    </div>
                    <div className="d-flex">
                        <div>
                        <label htmlFor="formFile" className="form-label dummy d-block invisible">DUMMY</label>
                        {smtSendBtn ?
                            <button className="btn btn-sm border-0 text-white themebg2" disabled>
                                <span className="spinner-border spinner-border-sm"></span> SEND
                            </button> :
                            <button className="btn btn-sm border-0 text-white themebg2" type="submit">SEND</button>
                        }
                        </div>
                        <div>
                            <label htmlFor="formFile" className="form-label dummy d-block invisible">DUMMY</label>
                            <a href="/Bulk_Payments_Sample.xlsx" className="btn btn-sm border-0 text-white themebg2" download>Sample ExcelSheet</a>
                        </div>
                    </div>
                </div>
            </form>

            <PagiSearch setSearch={setSearch}
                totalEntries={searchData.length}
                setStartOffset={setStartOffset}
                setTableDataStatus={setTableDataStatus} />

            <div className="table-responsive my-2">
                <table className="table table-bordered payout-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Batch No</th>
                            <th>User Id</th>
                            <th>Transfer Type</th>
                            <th>Payer Name</th>
                            <th>Amount</th>
                            <th>Beneficiary Name</th>
                            <th>Beneficiary Acc No</th>
                            <th>Beneficiary Address</th>
                            <th>Beneficiary Bank Name</th>
                            <th>Beneficiary Branch Address</th>
                            <th>Beneficiary Email Address</th>
                            <th>Beneficiary Ifsc Code</th>
                            <th>Beneficiary Mobile No</th>
                            <th>Beneficiary Pincode</th>
                            <th>Remark</th>
                            <th>Creation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length < 1 ? <tr><td colSpan={12}><h6>{tableDataStatus}</h6></td></tr> :
                        currentItems.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{startOffset + index + 1}</td>
                                    <td>{item.batchNo}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.transferType}</td>
                                    <td>{item.payerName}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.beneficiaryName}</td>
                                    <td>{item.beneficiaryAccNo}</td>
                                    <td>{item.beneficiaryAddress}</td>
                                    <td>{item.beneficiaryBankName}</td>
                                    <td>{item.beneficiaryBranchAddress}</td>
                                    <td>{item.beneficiaryEmailAddress}</td>
                                    <td>{item.beneficiaryIfscCode}</td>
                                    <td>{item.beneficiaryMobileNo}</td>
                                    <td>{item.beneficiaryPincode}</td>
                                    <td>{item.txnNote}</td>
                                    <td>{item.creationDate}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <PagiPageCount setStartOffset={setStartOffset}
            pageCount={pageCount} itemsPerPage={itemsPerPage} />

            {revBtn ? 
            <div className="text-center">
                <button type="button" className="btn border-0 text-white themebg2 mb-5" onClick={proceedToPay}>PROCEED TO PAY</button>
            </div>
            :''}

        </section>

    </>)
}

export default BulkFundTransfer;