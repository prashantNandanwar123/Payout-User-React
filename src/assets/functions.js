export const sortDate = (date) => {
    let dt = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (dt < 10) dt = '0' + dt;
    if (month < 10) month = '0' + month;
    return dt + '/' + month + '/' + year;
}

export const dateInNumbers = () => {
    let date = new Date().toLocaleString('it-IT').replace(/\/|,|:|\s/g,"");
    return date;
}

export const dateInNumbersR = () => {
    let dt = new Date().toLocaleString('it-IT').split(',');
    let d = dt[0].split('/');
    let t = dt[1].replace(/\/|:|\s/g,'');
    let date = d[2]+d[1]+d[0]+t;
    return date;
}

export const uploadValidFile = (e) => {
    let file = e.target.files[0];
    let msgElem = e.target.parentElement.querySelector('.inpErr')
    if(file && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        msgElem.textContent = 'Please upload valid (Excel) file';
        e.target.value = "";
    }else{
        msgElem.textContent = '';
    }
}