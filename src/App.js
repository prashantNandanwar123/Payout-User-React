import SidebarMenu from "./components/SidebarMenu";
import BeneficiaryManagement from "./screens/BeneficiaryManagement";
import FundTransfer from "./screens/FundTransfer";
import EntryPoint from "./screens/EntryPoint";
import { ToastContainer } from "react-toastify";
import Dashboard from "./screens/Dashboard";
import { useEffect, useState } from "react";
import FundTransferStatus from "./screens/FundTransferStatus";
import Wallet from "./screens/Wallet";
import BulkFundTransfer from "./screens/BulkFundTransfer";
import ResellerDashboard from "./screens/ResellerDashboard";
import ResellerFundTransferStatus from "./screens/ResellerFundTransferStatus";

const App = () => {

  const [isUser, setIsUser] = useState(false)
  const [isReseller, setIsReseller] = useState(false)
  const userDetails = sessionStorage.getItem('userDetails')
  // console.log("userDetails-->",userDetails)
  useEffect(() => {
    if(!isUser) sessionStorage.clear()
    if (userDetails) {
      let sessionOut = setTimeout(() => {
        alert("Timeout...")
        sessionStorage.clear()
        setIsUser(false)  
      }, 1800000) // 30 minutes
      return () => clearTimeout(sessionOut)
    }
  }, [userDetails,isUser])

  return (<>
    <div>
      {!isUser ? <EntryPoint userExist={setIsUser}  setIsReseller={setIsReseller} isReseller={isReseller} /> :
        <div className="container-fluid px-0">
          <div className="payout-app d-flex position-relative">
            <SidebarMenu isReseller={isReseller}/>
            <div className="main-area tab-content w-100 vh-100 overflow-auto p-3">
              <div id="dashboard" className="tab-pane active">
              {isReseller ?  <ResellerDashboard logout={setIsUser} /> :<Dashboard logout={setIsUser} /> }
              </div>
               <div id="wallet" className="tab-pane">
                <Wallet logout={setIsUser} isReseller={isReseller}/>
              </div>
              <div id="beneficiary" className="tab-pane">
              {!isReseller && <BeneficiaryManagement logout={setIsUser} isReseller={isReseller}/>}
              </div>
              <div id="fundtransfer" className="tab-pane">
              {!isReseller && <FundTransfer logout={setIsUser} isReseller={isReseller}/>}
              </div>
              <div id="transferstatus" className="tab-pane">
              {!isReseller && <FundTransferStatus logout={setIsUser} isReseller={isReseller}/>}
              </div>
              <div id="ResellerTransferstatus" className="tab-pane">
              {isReseller && <ResellerFundTransferStatus logout={setIsUser} isReseller={isReseller}/>}
              </div>
              <div id="bulkfundtransfer" className="tab-pane">
              {!isReseller && <BulkFundTransfer logout={setIsUser} isReseller={isReseller}/>}
              </div> 
            </div>
          </div>
        </div>}
      <ToastContainer theme="light" pauseOnFocusLoss={false} position="top-center" className="w-auto custom_toast" />
    </div>
  </>)
}

export default App;

//"bootstrap": "^5.2.0-beta1",
// background-color: #314e5a;
