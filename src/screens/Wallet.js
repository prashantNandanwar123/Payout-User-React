import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Navbar, { NavbarLogo } from "../components/Navbar";
import { PagiPageCount, PagiSearch } from "../components/PaginateTable";
import { DateInput } from "../components/MiniComps";
import { walletAction } from "../store/actions";
import { Input, SelectInput, Label } from "../components/RHF";
import { typeNumber, typeFloatNumber, blankSpace, alphaRex, fetchApi } from "../assets/customValidation";
import wallet from "../assets/images/wallet.png";
import ResellerNavbar from "../components/ResellerNavbar";

const Wallet = (props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const [startOffset, setStartOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [tableDataStatus, setTableDataStatus] = useState('');

    const [walletBal, setWalletBal] = useState(0);

    const dispatch = useDispatch();
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const closeDepositRef = useRef(null);

    // const walletBalData = useSelector(state => state.walletBal);

    const depositData = useSelector(state => state.benefData);
    const itemsPerPage = 10;
    const searchData = depositData.data.filter(item => Object.values(item).join("").toString().toLowerCase().includes(search.toLowerCase()))
    const endOffset = startOffset + itemsPerPage;
    const currentItems = searchData.slice(startOffset, endOffset)
    const pageCount = Math.ceil(searchData.length / itemsPerPage)

    useEffect(() => {
        if (depositData.loading) {
            setTableDataStatus('Loading...')
        } else {
            setTableDataStatus('Not Found')
        }
        (async()=>{
            let [res, result] = await fetchApi('fetchWalletBalance', 'POST', { userId:userDetails?.userId })
            if (res.status === 200) {
                setWalletBal(result.respData)
            }
        })()
    }, [depositData.loading])

    const searchDataByDate = async (e) => {
        e.preventDefault();
        let fromDate = fromDateRef.current.value;
        let toDate = toDateRef.current.value;
        dispatch(walletAction(fromDate,toDate))
    }

    // const depositHandler = async (data) => {
    //     let txnId = 'TXN'+(new Date()).valueOf();
    //     try {
    //         let [res, result] = await fetchApi('loadMoney', 'POST', {...data, userId:userDetails?.userId, txnId});
    //         if (res.status !== 200) {
    //             toast.error('something went wrong : '+res.status, { toastId: 1 })
    //         } else {
    //             if (result.respCode === 1) {
    //                 toast.error(result.respMsg, { toastId: 1 })
    //             } else {
    //                 toast.success(result.respMsg, { toastId: 0 })
    //                 reset();
    //                 closeDepositRef.current.click()
    //                 // dispatch(walletAction())---------------------------
    //                 dispatch(walletAction({ newDeposit: result.respData }));
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }----------------------------

    const depositHandler = async (data) => {
        let txnId = 'TXN'+(new Date()).valueOf();
        try {
            let [res, result] = await fetchApi('loadMoney', 'POST', { ...data, userId: userDetails?.userId, txnId });
            if (res.status !== 200) {
                toast.error('Something went wrong: ' + res.status, { toastId: 1 });
            } else {
                if (result.respCode === 1) {
                    toast.error(result.respMsg, { toastId: 1 });
                } else {
                    toast.success(result.respMsg, { toastId: 0 });
                    dispatch(walletAction()); 
                    reset();
                    closeDepositRef.current.click();
                    
                    // Prepare the new deposit record
                    const newDeposit = {
                        userId: userDetails?.userId,
                        txnId,
                        mode: data.mode,
                        previousBalance: walletBal, // Assuming walletBal is the current wallet balance
                        depositeAmount: data.depositeAmount,
                        availableBalance: walletBal + parseFloat(data.depositeAmount),
                        txnType: 'Deposit',
                        status: 'Success',
                        dateTime: new Date().toISOString(),
                        refNoUtr: data.refNoUtr,
                        remark: 'Deposit via ' + data.mode
                    };
    
                    // Dispatch the walletAction with newDeposit
                    dispatch(walletAction(null, null, newDeposit));  // Pass new deposit to action
    
                    // Optionally, you could trigger wallet balance refresh as well
                    // dispatch(walletAction()); // This could also fetch the updated balance
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    return (<>
        <section>
            
            <NavbarLogo />
           {props.isReseller ?<ResellerNavbar idx={3} logout={props.logout} title="TOP UP" />
                             : <Navbar idx={3} logout={props.logout} title="TOP UP" /> } 

            {/* <div className="mb-4 wallet-sec">
                <div className="wallet-card border p-4 rounded text-center text-white">
                    <img className="mb-2" src={wallet} alt="wallet" width={80} />
                    <h4>WALLET BALANCE</h4>
                    <strong><i className="bi bi-currency-rupee"></i>{walletBal}</strong>
                </div>
                <button type="button" className="btn text-white themebg2" data-bs-toggle="modal" data-bs-target="#depositmodal"><i className="bi bi-plus-lg"></i> DEPOSIT MONEY</button>
            </div> */}

            <form className="rounded mb-4" onSubmit={handleSubmit(depositHandler)} autoComplete="off">
                <div className="row">
                    {/* <div className="col-sm-3">
                         <div className="border p-2 mb-2 rounded d-flex align-items-center justify-content-center">
                            <h6 className="mb-0">User Id :</h6>
                            <strong className="ms-2">{userDetails?.userId}</strong>
                        </div> 
                        <div className="mb-2">
                            <Label for="loadamt" name="User Id" req={true} />
                            <input type="text" className="form-control shadow-none" value={userDetails?.userId} readOnly />
                        </div>
                    </div> */}
                    <div className="col-sm-3">
                        <div className="mb-2">
                            <Label for="loadamt" name="Deposit Amount" req={true} />
                            <Input register={register} req={true} id="loadamt" name="depositeAmount" 
                            errors={errors.loadAmount} regex={''} onInput={typeFloatNumber} />
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="mb-2">
                            <Label for="mode" name="Mode" req={true} />
                            <SelectInput register={register} req={true} option={["NEFT", "IMPS", "RTGS"]}
                            name="mode" regex={alphaRex} onInput={blankSpace} />
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="mb-2">
                            <Label for="refno" name="Ref No / UTR" req={true} />
                            <Input register={register} req={true} id="refno" name="refNoUtr" 
                            errors={errors.refNo} regex={''} onInput={typeNumber} />
                        </div>
                    </div>
               
                <div className="col-sm-3 mt-4 "     style={{paddingLeft: '50px', paddingTop:'5px'}}>
                    {/* <button type="button" className="btn btn-danger me-2" data-bs-dismiss="modal" ref={closeDepositRef}>Close</button> */}
                    <button type="submit" className="btn text-white themebg2" style={{    padding: '7px 25px 7px 25px',marginLeft: '60px'}}>Deposit</button>
                </div>
                </div>
            </form>

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
                            <th>Txn Id</th>
                            <th>Mode</th>
                            <th>Previous Balance</th>
                            <th>Deposite Amount</th>
                            <th>Available Balance</th>
                            <th>Txn Type</th>
                            <th>Status</th>
                            <th>Deposite Date</th>
                            <th>Ref No / UTR</th>
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
                                    <td>{item.txnId}</td>
                                    <td>{item.mode}</td>
                                    <td>{item.previousBalance}</td>
                                    <td>{item.depositeAmount}</td>
                                    <td>{item.availableBalance}</td>
                                    <td>{item.txnType}</td>
                                    <td>{item.status}</td>
                                    <td>{item.dateTime}</td>
                                    <td>{item.refNoUtr}</td>
                                    <td>{item.remark}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <PagiPageCount setStartOffset={setStartOffset}
            pageCount={pageCount} itemsPerPage={itemsPerPage} />
            
            {/* <div className="modal fade" id="depositmodal" data-bs-backdrop="static">
                <div className="modal-dialog modal-sm modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">DEPOSIT MONEY -</h5>
                        </div>
                        <div className="modal-body">
                            <form className="px-3 rounded mb-3" onSubmit={handleSubmit(depositHandler)} autoComplete="off">
                                <div className="border p-2 mb-2 rounded d-flex align-items-center justify-content-center">
                                    <h6 className="mb-0">User Id :</h6>
                                    <strong className="ms-2">{userDetails?.userId}</strong>
                                </div>
                                <div className="mb-2">
                                    <Label for="loadamt" name="Deposit Amount" req={true} />
                                    <Input register={register} req={true} id="loadamt" name="depositeAmount" 
                                    errors={errors.loadAmount} regex={''} onInput={typeFloatNumber} />
                                </div>
                                <div className="mb-2">
                                    <Label for="mode" name="Mode" req={true} />
                                    <SelectInput register={register} req={true} option={["NEFT", "IMPS", "RTGS"]}
                                    name="mode" regex={alphaRex} onInput={blankSpace} />
                                </div>
                                <div className="mb-2">
                                    <Label for="refno" name="Ref No / UTR" req={true} />
                                    <Input register={register} req={true} id="refno" name="refNoUtr" 
                                    errors={errors.refNo} regex={''} onInput={typeNumber} />
                                </div>
                                <div className="text-center mt-3">
                                    <button type="button" className="btn btn-danger mx-2" data-bs-dismiss="modal" ref={closeDepositRef}>Close</button>
                                    <button type="submit" className="btn text-white themebg2 mx-2">Deposit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div> */}

        </section>

    </>)
}

export default Wallet;