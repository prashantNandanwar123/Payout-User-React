import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { benefDataAction, dbAction, fundDataAction, reDbAction, transferStatusAction, transferStatusActionReseller, walletAction } from "../store/actions";

const SidebarMenu = ({isReseller}) => {

    const [navStatus, setNavStatus] = useState(true);//hamburgerHandler
    const dispatch = useDispatch();

    useEffect(() => {
        let payout = document.querySelector('.payout-nav');
        let sideName = document.querySelectorAll('.sidename');

        if (window.matchMedia("(max-width: 700px)").matches) {
            sideName.forEach(elem => elem.style.display = "none");
            if (!navStatus) {
                payout.style.position = "fixed";
                sideName.forEach(elem => elem.style.display = "inline-block");
            } else {
                payout.style.position = "initial";
            }
        }
    }, [navStatus])

    const fundReport = () => {
        dispatch(transferStatusAction('getAllTransactionByUser'))
        dispatch({type:'DATE_STATUS'})
    }

    const reFundReport = () => {
        dispatch(transferStatusActionReseller('getAllTransactionByResellerAndDate',null,null))

        // dispatch({type:'DATE_STATUS'})
    }

    return (
        <div>
            <aside className="payout-nav nav-pills border-end vh-100">
                <ul className="list-group w-100" role="tablist">
                    <li className="list-group-item border-0 p-0 d-flex align-items-center bg-transparent hamburger-logo">
                        <div className="nav-link rounded pe-3 pb-3 w-100 text-end" href="#">
                            <button type="button" className="btn p-0 border-0 text-white" onClick={() => setNavStatus(!navStatus)}>
                                <i className="bi bi-list"></i>
                            </button>
                            {/* <img style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 p-1 sidename" src={logo} alt="logo" width="180px" /> */}
                        </div>
                    </li>
                    <li className="list-group-item border-0 p-0 text-nowrap bg-transparent">
                        <a className="nav-link rounded p-3 active" data-bs-toggle="pill" href="#dashboard" onClick={()=>dispatch(!isReseller ? dbAction() : reDbAction())}>
                            <i className="bi bi-speedometer2"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">DASHBOARD</strong>
                        </a>
                    </li>
                    {!isReseller && <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                        <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#wallet" onClick={()=>dispatch(walletAction())}>
                            <i className="bi bi-plus-lg"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">TOP UP</strong>
                        </a>
                    </li>}
                    {!isReseller && <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                        <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#beneficiary" onClick={()=>dispatch(benefDataAction(null,null,'pagestart'))}>
                            <i className="bi bi-person-badge"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">  BENEFICIARY MANAGEMENT</strong>
                        </a>
                    </li>}
                    {!isReseller && <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                        <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#fundtransfer" onClick={()=>dispatch(fundDataAction())}>
                            <i className="bi bi-arrow-repeat"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">FUND TRANSFER</strong>
                        </a>
                    </li>}
                    {!isReseller && <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                        <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#bulkfundtransfer" onClick={()=>dispatch(fundDataAction())}>
                            <i className="bi bi-folder-symlink"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">BULK PAYMENTS</strong>
                        </a>
                    </li>}
                    {!isReseller ? <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                        <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#transferstatus" onClick={fundReport}>
                            <i className="bi bi-radioactive"></i>
                            <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">FUND TRANSFER STATUS</strong>
                        </a>
                    </li>:
                    <li className="list-group-item bg-transparent border-0 p-0 text-nowrap">
                    <a className="nav-link rounded p-3" data-bs-toggle="pill" href="#ResellerTransferstatus" onClick={reFundReport}>
                        <i className="bi bi-radioactive"></i>
                        <strong style={{ display: navStatus ? "inline-block" : "none" }} className="ms-2 sidename">FUND TRANSFER STATUS</strong>
                    </a>
                </li>}
                </ul>
            </aside>
        </div>
    )
}

export default SidebarMenu;