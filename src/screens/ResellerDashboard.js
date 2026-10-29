import { useEffect, useReducer, useRef } from 'react';
import Navbar, { NavbarLogo } from "../components/Navbar";
import { DateInput } from "../components/MiniComps";
import { LineChart, PieChart } from "../components/Chart";
import { dbAction, reDbAction } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import ResellerNavbar from '../components/ResellerNavbar';

function ResellerDashboard(props) {

    const dispatch = useDispatch();
    const dbData = useSelector(state => state.dbData);
//console.log("dbData",dbData.dashboardDetails)
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    // const userDetails = JSON.parse(sessionStorage.getItem('reUserDetails'));
    // console.log("userD-->",userDetails)

    // const [dbData, setDBData] = useState({})
    // const [pieData, setPieData] = useState([])

    useEffect(() => {
        dispatch(reDbAction())
        
    }, [])

    const searchDataByDate = (e) => {
        if(e) e.preventDefault();
        let fromDate = fromDateRef.current.value;
        let toDate = toDateRef.current.value;
        dispatch(reDbAction(fromDate,toDate))

        // if(e) e.preventDefault();
        // try {
        //     let userId = userDetails.userId;
        //     let fromDate = fromDateRef.current.value;
        //     let toDate = toDateRef.current.value;
        //     // console.log(fromDate+"--"+toDate)
        //     let [res, result] = await fetchApi('userDashboard', 'POST', {fromDate,toDate,userId})
        //     console.log(result)
        //     if (res.status === 200) {
        //         if(result.respData.dashboardDetails){
        //             setPieData(result.respData.dashboardDetails)
        //         }
        //         setDBData(result.respData)
        //     }
        // } catch (error) {
        //     console.log(error)
        // } 
    }

    // console.log(dbData)

    return (
        <section>
            <NavbarLogo />
            <ResellerNavbar idx={3} logout={props.logout} title="RESELLER DASHBOARD" />
            {/* <h2 className="text-uppercase">Welcome '{userDetails.firstName}'</h2> */}

            <form className="mb-3 db-search-form" onSubmit={searchDataByDate}>
                <div className="d-flex justify-content-end">
                    <div className="mb-2 ms-sm-3">
                        <DateInput dateRef={fromDateRef} />
                    </div>
                    <div className="mb-2 ms-sm-3">
                        <DateInput dateRef={toDateRef} />
                    </div>
                    <div className="mb-2 ms-sm-3">
                        <button type="submit" className="btn btn-sm border-0 text-white themebg2 me-2 px-3"><i className="bi bi-search"></i></button>
                    </div>
                </div>
            </form>

            <div className="row mb-3">
                <div className="col-md-6 col-lg-4">
                    <div className="db-box db-box-1 position-relative border p-3 text-center mb-3">
                        <h6 className="mb-2 fw-bold">SUCCESS TRANSACTIONS</h6>
                        {/* <i className="fa-solid fa-circle-check"></i> */}
                        <i className="bi bi-check-circle-fill"></i>
                        <strong className="d-block mt-1">{dbData.dashboardDetails?dbData.dashboardDetails[0]:0}</strong>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="db-box db-box-2 position-relative border p-3 text-center mb-3">
                        <h6 className="mb-2 fw-bold">TRANSFER AMOUNT</h6>
                        {/* <i className="fa-solid fa-sack-dollar"></i> */}
                        <i className="bi bi-cash-coin"></i>
                        <strong className="d-block mt-1">&#8377; {dbData.dashboardDetails?dbData.dashboardDetails[1]:0}</strong>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="db-box db-box-3 position-relative border p-3 text-center mb-3">
                        <h6 className="mb-2 fw-bold">COMMISSION AMOUNT</h6>
                        <i className="bi bi-clock-fill"></i>
                        <strong className="d-block mt-1">{dbData.dashboardDetails?dbData.dashboardDetails[2]:0}</strong>
                    </div>
                </div>
                {/* <div className="col-md-6 col-lg-3">
                    <div className="db-box db-box-4 position-relative border p-3 text-center mb-3">
                        <h6 className="mb-2 fw-bold">INPROGRESS AMOUNT</h6>
                        <i className="bi bi-cash-coin"></i>
                        <strong className="d-block mt-1">&#8377; {dbData.dashboardDetails?dbData.dashboardDetails[3]:0}</strong>
                    </div>
                </div> */}
            </div>

            {/* <div className="dbchart mb-5">
               //  <LineChart yData={dbData.xAxisValues} xData={dbData.yAxisValues} /> 
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='border p-3 h-100'>
                            <LineChart yData={dbData.xAxisValues} xData={dbData.yAxisValues} />
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='border p-3 h-100'>
                            <h6 className='text-secondary mb-3 text-center'><small>STATUS CHART</small></h6>
                            <PieChart pieData={dbData.dashboardDetails} />
                            // <table className="table table-sm table-bordered mb-0 mt-3">
                             //   <tbody>
                             //       <tr>
                             //           <td className='bg-success text-white'><strong>SUCCESS</strong></td>
                             //           <td>80%</td>
                             //       </tr>
                              //      <tr>
                              //          <td className='bg-danger text-white'><strong>FAILED</strong></td>
                              //          <td>10%</td>
                              //      </tr>
                              //      <tr>
                              //          <td className='bg-warning text-white'><strong>PENDING</strong></td>
                              //          <td>10%</td>
                               //     </tr>
                               // </tbody>
                            //</table>
                            <div className='piestatus mt-3'>
                                <div className="progress mb-2 text-center">
                                    <div className="progress-bar bg-success" role="progressbar" 
                                    style={{width: `${dbData.dashboardDetails?dbData.dashboardDetails[4]:0}%` }}>
                                    </div>
                                    <span>SUCCESS</span>
                                </div>
                                <div className="progress mb-2 text-center">
                                    <div className="progress-bar bg-warning" role="progressbar" 
                                    style={{width: `${dbData.dashboardDetails?dbData.dashboardDetails[5]:0}%` }}>
                                    </div>
                                    <span>INPROGRESS</span>
                                </div>
                                <div className="progress mb-2 text-center">
                                    <div className="progress-bar bg-danger" role="progressbar" 
                                    style={{width: `${dbData.dashboardDetails?dbData.dashboardDetails[6]:0}%` }}>
                                    </div>
                                    <span>FAILED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  */}

        </section>
    )
}

export default ResellerDashboard