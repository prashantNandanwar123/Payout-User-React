export const alphaRex = {
    pattern:{
        value:/^[A-Za-z]+$/i, 
        message:'This field allow alpha values'
    }     
}

export const alphaSpaceRex = {
    pattern:{
        value:/^[A-Za-z\s]+$/i, 
        message:'This field allow alpha and space'
    }     
}

export const alphaNumRex = {
    pattern:{
        value:/^[A-Za-z0-9]+$/i, 
        message:'This field allow alpha numeric values'
    }     
}

export const emailRex = {
    pattern:{
        value:/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i, 
        message:'Please enter a valid email address'
    }     
}

export const req = {
    required:{
        value:true,
        message:'This field is required'
    }
}

export const eMobRex = {
    pattern:{
        value:/^(?:\d{10}|[a-z0-9.]+@\w+\.\w{2,3})$/, 
        message:'Please enter a valid email / mobile no'
    }     
}



export const addrRex = {
    pattern:{
        value:/^[a-zA-z0-9/\\''(),-\s]+$/i, 
        message:'Please enter a valid address'
    }     
}

export const numRex = {
    pattern: /^[0-9]+$/i     
}

export const amtRex = {
    pattern:{
        value:/^([1-9])+([0-9])*(\.[0-9]{2})?$/i, 
        message:'Please enter valid amount'
    }     
}

// export const specialAlphaSpaceRex = {
//     pattern:{
//         value:/^[A-Za-z&\s]+$/i, 
//         message:'This field allow alpha and space'
//     }       
// }

// export const _amtRex = {
//     pattern:{
//         value:/^[1-9]+[0-9]+$/i, 
//         message:'Please enter valid amount'
//     }     
// }

export const stopType = (e) => {
    e.target.value = e.target.value.replace(/[^]/g, '');
}

export const blankSpace = (e) => {
    if(e.target.value.trim() === ""){
        e.target.value = e.target.value.trim();
    }
}

export const typeNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
}

export const typeFloatNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
}

export const stopTags = (e) => {
    e.target.value = e.target.value.replace(/<|>/g, '');
}

export const spaceStopTags = (e) => {
    e.target.value = e.target.value.replace(/[<|>\s]/g, '');
}

export const typeIfsc = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    e.target.value = e.target.value.toUpperCase();
}

export const upperCaseCvt = (e) => {
    e.target.value = e.target.value.toUpperCase();
}

export const fetchApi = async (url,method,body) => {
    let data = body !== null ? JSON.stringify(body) : null;
    try {
        let settings = { 
            method : method,
            headers : {'Accept':'application/json','Content-Type':'application/json'}, 
            body : data 
        }
        let res = await fetch(`api/${url}`, settings)
        let result = await res.json();
        return [res,result];   
    } catch (error) {
        console.log(error)
    }
}

export const fetchFileApi = async (url,body) => {
    try {
        let res = await fetch(`api/${url}`, {method : 'POST', body : body} )
        let result = await res.json();
        return [res,result];   
    } catch (error) {
        console.log(error)
    }
}

export const getBenefDataAction = async (status) => {
    const { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
    let [res, result] = await fetchApi('getAllBeneficiary', 'POST', { userId, status })
    return [res,result];   
}

export const fetchIfscApi = async (ifscVal) => {
    try {
        let res = await fetch(`api/verifyIfsc/${ifscVal}`)
        let result = await res.json();
        return [res,result];
    } catch (error) {
        console.log(error)
    }
}


export const generateOrderId =  ()=>{
 
        const now = new Date();
      
        const pad = (n, width = 2) => String(n).padStart(width, '0');
        const yy = String(now.getFullYear()).slice(2);
        const MM = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const hh = pad(now.getHours());
        const mm = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        const SSS = pad(now.getMilliseconds(), 3);
      
        return `PD${yy}${MM}${dd}${hh}${mm}${ss}${SSS}`;
      
}
