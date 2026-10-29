import { useSelector } from "react-redux";
import Navbar, { NavbarLogo } from "../components/Navbar";

const FundTransferStatus = (props) => {

    const transferStatusData = useSelector(state => state.benefData);
    //console.log(transferStatusData)

    return (<>
        <section>
            <NavbarLogo />
            <Navbar logout={props.logout} title="FUND TRANSFER STATUS" />
            <div className="table-responsive mt-4">
                <table className="table table-bordered payout-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Txn Ref Id</th>
                            <th>Initiated Date</th>
                            <th>Amount</th>
                            <th>Status</th>
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
                        {transferStatusData.loading ? <tr><td colSpan={12}><h6>Loading...</h6></td></tr> : 
                        transferStatusData.data.map((item,index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{index+1}</td>
                                    <td>{item.txnRefId}</td>
                                    <td>{item.requestInitiateddate}</td>
                                    <td>{item.requestAmount}</td>
                                    <td>{item.respMsg}</td>
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
        </section>

    </>)
}

export default FundTransferStatus;