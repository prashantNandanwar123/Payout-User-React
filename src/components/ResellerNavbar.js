import { useState,useEffect } from 'react';
import { LegendInput } from './MiniComps';
import logo from '../assets/images/logo.png';

const ResellerNavbar = (props) => {
  const userDetails = JSON.parse(sessionStorage.getItem('reUserDetails'));


  return (<>
    <nav className="screen-title border px-3 py-2 d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0">{props.title}</h6>
        <ul className="navbar-nav flex-row align-items-center">
        
          <li className="nav-item dropdown ms-3 d-flex gap-4 align-items-center">
            <button className="nav-link dropdown-toggle p-0 bg-transparent border-0 text-uppercase" data-bs-toggle="dropdown">
              <i className="bi bi-person-circle pe-1"></i>
              <strong>{userDetails.name}</strong>
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
                  <div className='col-md-4 mb-2'><LegendInput label='User Id' val={userDetails?.userId} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Pan No.' val={userDetails?.panNo} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Email Id' val={userDetails?.emailNo} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Mobile No.' val={userDetails?.mobileNo} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Adhar No.' val={userDetails?.adharNo} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Status' val={userDetails?.status} /></div>
                  <div className='col-md-4 mb-2'><LegendInput label='Company Name' val={userDetails?.companyName} /></div>
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

export default ResellerNavbar;