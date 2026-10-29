import { toast } from "react-toastify";
import { fetchApi } from "../assets/customValidation";

export const benefDataAction = (id,status,page) => async dispatch => {
    // console.log(id,status)
    if(page === 'pagestart'){
        let radioInp = document.querySelector('.fts_filter input[type=radio]:checked');
        if(radioInp){ radioInp.checked = false }
    }
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));

        if(id){
            let [res, result] = await fetchApi(`deleteBeneficiaryById/${id}`, 'POST')
            if (res.status === 200) {
                toast.success(result.respMsg, { toastId: 0 })
            }
        }
        dispatch({ type: 'DATA_LOADING' })
        let [res, result] = await fetchApi('getAllBeneficiary', 'POST', { userId,status })
        //console.log(result)
        if (res.status === 200) {
            dispatch({ type: 'GET_BENEF_DATA', payload: result.respData })
        }
    } catch (error) {
        console.log(error)
    }
}

export const fundDataAction = () => async dispatch => {
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        dispatch({ type: 'DATA_LOADING' })
        let [res, result] = await fetchApi('getAllApprovedBeneficiary', 'POST', { userId })
        if (res.status === 200) {
            dispatch({ type: 'GET_BENEF_DATA', payload: result.respData })
        }
    } catch (error) {
        console.log(error)
    }
}

export const transferStatusAction = (url,fromDate,toDate) => async dispatch => {
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        dispatch({ type: 'DATA_LOADING', payload: [] })
        let [res, result] = await fetchApi(url, 'POST', { userId,fromDate,toDate })
        if (res.status === 200) {
            let data = result.respData.sort((a,b)=>{
                let c = new Date(a.requestInitiateddate);
                let d = new Date(b.requestInitiateddate);
                return d - c;
            })
            dispatch({ type: 'GET_BENEF_DATA', payload: data })
        } 
    } catch (error) {
        console.log(error)
    }
}

export const dbAction = (fromDate,toDate) => async dispatch => {
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let [res, result] = await fetchApi('userDashboard', 'POST', {fromDate,toDate,userId})
        if (res.status === 200) {
            dispatch({ type: 'GET_DB_DATA', payload: result.respData })
        }
    } catch (error) {
        console.log(error)
    }
}

export const reDbAction = (fromDate,toDate) => async dispatch => {
    try {
            const {userId}= JSON.parse(sessionStorage.getItem('reUserDetails'));
     console.log("userD1-->",userId)
    let [res, result] = await fetchApi('resellerDashboard', 'POST', {fromDate,toDate,userId})
        if (res.status === 200) {
            // console.log("data-",result.respData)
            dispatch({ type: 'GET_RE_DB_DATA', payload: result.respData })
        }
    } catch (error) {
        console.log(error)
    }
}

export const transferStatusActionReseller = (url,fromDate,toDate) => async dispatch => {
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('reUserDetails'));
        dispatch({ type: 'DATA_LOADING', payload: [] })
        let [res, result] = await fetchApi(url, 'POST', { userId,fromDate,toDate })
        if (res.status === 200) {
            let data = result.respData.sort((a,b)=>{
                let c = new Date(a.requestInitiateddate);
                let d = new Date(b.requestInitiateddate);
                return d - c;
            })
            dispatch({ type: 'GET_RE_BENEF_DATA', payload: data })
        } 
    } catch (error) {
        console.log(error)
    }
}



// Wallet Action
export const walletAction = (fDate,tDate) => async dispatch => {
    try {
        const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        dispatch({ type: 'DATA_LOADING' })
        if(fDate && tDate){
            let [res, result] = await fetchApi('fetchWalletByDate', 'POST', { userId,fDate,tDate })
            // console.log(res)
            // console.log(result)
            if (res.status === 200) {
                let data = result.respData.sort((a,b)=>{
                    let c = new Date(a.dateTime);
                    let d = new Date(b.dateTime);
                    return d - c;
                })
                dispatch({ type: 'GET_BENEF_DATA', payload: data })
            }
        }else{
            let [res, result] = await fetchApi('fetchWallet', 'POST', { userId })
            if (res.status === 200) {
                let data = result.respData.sort((a,b)=>{
                    let c = new Date(a.dateTime);
                    let d = new Date(b.dateTime);
                    return d - c;
                })
                dispatch({ type: 'GET_BENEF_DATA', payload: data })
            }
        }
    } catch (error) {
        console.log(error)
    }
}