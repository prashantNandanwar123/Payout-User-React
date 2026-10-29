import { useDispatch, useSelector } from "react-redux";
import Navbar, { NavbarLogo } from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { PagiPageCount, PagiSearch, SortTableHeader } from "../components/PaginateTable";
import { DateInput } from "../components/MiniComps";
import { transferStatusActionReseller } from "../store/actions";
import * as XLSX from "xlsx";
import { dateInNumbers } from "../assets/functions";
import ResellerNavbar from "../components/ResellerNavbar";

const ResellerFundTransferStatus = (props) => {

    // const [fundStatusData, setFundStatusData] = useState([]);
    // const [dataFilter, setDataFilter] = useState([]);
    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');
    const dispatch = useDispatch();
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    const transferStatusData = useSelector(state => state.benefData);
    // console.log("transferStatusData-",transferStatusData)
    const itemsPerPage = 10;
    const searchData = transferStatusData.data.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        //console.log(transferStatusData)
        if (transferStatusData.loading) {
            setTableDataStatus('Loading...')
        } else {
            setTableDataStatus('Not Found')
        }
    }, [transferStatusData.loading])

    const searchDataByDate = async (e) => {
        e.preventDefault();
        let fromDate = fromDateRef.current.value;
        let toDate = toDateRef.current.value;
        dispatch(transferStatusActionReseller('getAllTransactionByResellerAndDate',fromDate,toDate))
    }

    // Export To Download Report
    const exportToDownloadReport = () => {
        let date = dateInNumbers();
        let workbook = XLSX.utils.book_new();
        let reportData = searchData.map((item) => {
            return {TxnRefId:item.txnRefId, OrderId:item.merchantTrxnRefId, InitiatedDate:item.requestInitiateddate,
            Amount:item.requestAmount,  Status:item.respMsg,  Name:item.payeeName, PaymentMode:item.payeeMode,
            BankName:item.payeeAccountBankName, BankBranchAddress:item.payeeAccountBranchAddress,
            Ifsc:item.payeeAccountIfsc, AccountNumber:item.payeeAccountNumber, Address:item.payeeAddress, 
            Email:item.payeeEmail, Mobile:item.payeeMobile, RRN:item.rrn, Remark:item.userRemark}})
        let worksheet = XLSX.utils.json_to_sheet(reportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "TxnReport");
        XLSX.writeFile(workbook, `TxnReport_${date}.xlsx`);
    }

    return (<>
        <section>
            
            <NavbarLogo />
            <ResellerNavbar idx={3} logout={props.logout} title="RESELLER FUND TRANSFER STATUS" />

            <form className="mb-2" onSubmit={searchDataByDate}>
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
                            <th>User Id</th>
                            <th>User Name</th>
                            <th>Txn Ref Id</th>
                            <th>Order Id</th>
                            <th><SortTableHeader text="Initiated Date" dateName="Initiated" /></th>
                            <th>Amount</th>
                            {/* <th>GST</th>
                            <th>MDR</th>
                            <th>Previous Balance</th>
                            <th>Final Amount</th>
                            <th>Available Amount</th> */}
                            <th>Status</th>
                            {/* <th>Reversal Status</th> */}
                            <th>RNN</th>
                            {/* <th>Description Status</th> */}
                            <th>Name</th>
                            <th>Payment Mode</th>
                            <th>Account Bank Name</th>
                            <th>Account Branch Address</th>
                            <th>Account Ifsc</th>
                            <th>Account Number</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length < 1 ? <tr><td colSpan={12}><h6>{tableDataStatus}</h6></td></tr> :
                        currentItems.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{startOffset + index + 1}</td>                                    
                                    <td>{item.userId}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.txnRefId}</td>
                                    <td>{item.merchantTrxnRefId}</td>
                                    <td>{item.requestInitiateddate}</td>
                                    <td>{item.requestAmount}</td>
                                    {/* <td>{item.gst}</td>
                                    <td>{item.mdr}</td>
                                    <td>{item.prevBal}</td>
                                    <td>{item.finalAmount}</td>
                                    <td>{item.availBal}</td> */}
                                    <td>{item.respMsg}</td>
                                    {/* <td>{item.reversalStatus}</td> */}
                                    <td>{item.rrn}</td>
                                    {/* <td>{item.description}</td> */}
                                    <td>{item.payeeName}</td>
                                    <td>{item.payeeMode}</td>
                                    <td>{item.payeeAccountBankName}</td>
                                    <td>{item.payeeAccountBranchAddress}</td>
                                    <td>{item.payeeAccountIfsc}</td>
                                    <td>{item.payeeAccountNumber}</td>
                                    <td>{item.payeeAddress}</td>
                                    <td>{item.payeeEmail}</td>
                                    <td>{item.payeeMobile}</td>
                                    <td>{item.userRemark}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <PagiPageCount setStartOffset={setStartOffset}
            pageCount={pageCount} itemsPerPage={itemsPerPage} />

        </section>

    </>)
}


export default ResellerFundTransferStatus;