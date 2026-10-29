import { useState,useEffect } from 'react';
import { LegendInput } from './MiniComps';
import logo from '../assets/images/logo.png';
import { walletAction } from "../store/actions";
import { fetchApi } from '../assets/customValidation';

const Navbar = (props) => {
  const [walletBal, setWalletBal] = useState(0);
  const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
  useEffect(()=>{
    (async()=>{
      let [res, result] = await fetchApi('fetchWalletBalance', 'POST', { userId:userDetails?.userId })
      if (res.status === 200) {
        // console.log("result.respData=",result.respData)
          setWalletBal(result.respData)
          // console.log("walletBal===",walletBal)

      }
    })()
  })
  //console.log(userDetails)

  return (<>
    <nav className="screen-title border px-3 py-2 d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0">{props.title}</h6>
        <ul className="navbar-nav flex-row align-items-center">
          
          {/* <li className='text-uppercase d-flex align-items-center'>
            <i className="bi bi-person-circle pe-2"></i>
            <strong>{userDetails.firstName}</strong>
          </li>
          
          <li className="nav-item dropdown ms-3">
            <button className="nav-link dropdown-toggle p-0 bg-transparent border-0 text-uppercase" data-bs-toggle="dropdown">
              <i className="bi bi-power"></i>
            </button>
            <ul className="dropdown-menu py-1">
              <li>
                <button className="dropdown-item" onClick={()=> props.logout(false)}>Logout</button>
              </li>
            </ul>
          </li> */}

          <li className="nav-item dropdown ms-3 d-flex gap-4 align-items-center">
          <strong className='d-flex gap-2 align-items-center'><i className="bi bi-wallet2"></i>{walletBal}</strong>
            <button className="nav-link dropdown-toggle p-0 bg-transparent border-0 text-uppercase" data-bs-toggle="dropdown">
              <i className="bi bi-person-circle pe-1"></i>
              <strong>{userDetails.firstName}</strong>
            </button>
            <ul className="dropdown-menu py-1">
              <li>
                <button className="dropdown-item" data-bs-toggle="modal" data-bs-target={`#profileModal_${props.idx}`}>
                  <i className="bi bi-person"></i> Profile
                </button>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item" onClick={()=> props.logout(false)}>
                  <i className="bi bi-power"></i> Logout
                </button>
              </li>
            </ul>
          </li>
      </ul>
    </nav>

    {/* Model Start */}
    <div className="modal fade" id={`profileModal_${props.idx}`} data-bs-backdrop="static">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title ps-2 text-secondary">USER DETAILS</h5>
              </div>

              <div className="modal-body p-4 pt-3">
                
                <div className='row'>
                  <div className='col-md-4 mb-2'><LegendInput label='User Id' val={userDetails.userId} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='First Name' val={userDetails.firstName} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Last Name' val={userDetails.lastName} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Gender' val={userDetails.gender} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Email Id' val={userDetails.emailId} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Address' val={userDetails.address} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='City' val={userDetails.city} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='State' val={userDetails.state} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Pin Code' val={userDetails.pincode} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Company Name' val={userDetails.companyName} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Company Address' val={userDetails.companyAddress} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='A/c No.' val={userDetails.merchantBankAccountNumber} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Bank Name' val={userDetails.merchantBankName} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Ifsc' val={userDetails.merchantBankIfsc} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Client Id' val={userDetails.clientId} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Client Secret' val={userDetails.clientSecret} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='A/c Status' val={userDetails.accountStatus} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Creation Date' val={userDetails.creationDate} /></div>
                </div>

                <button type="button" className="btn btn-secondary w-100 mt-3" data-bs-dismiss="modal">BACK</button>
              </div>

            </div>
        </div>
    </div>
    {/* Model End */}

  </>)
}

export const NavbarLogo = () => {
  return (
    <img className="mb-2" src={logo} alt="logo" width="150px" />
  )
}

export default Navbar;