const initialState = {
    benefState : {
        data: [],
        loading: false,
    },
};

export const benefDataReducer = ({benefState} = initialState, {type,payload}) => {
    //console.log(type)
    switch (type) {
        case 'DATA_LOADING':
            return {...benefState, data:[], loading:true}    
        case 'GET_BENEF_DATA':
            return {...benefState, data:payload, loading:false}
        case 'GET_RE_BENEF_DATA':
            return {...benefState, data:payload, loading:false}
        default:
            return {...benefState, data:[], loading:true}
    }
}

export const dateStatusReducer = (state = true, action) => {
    //console.log(action.type)
    switch (action.type) {
       case 'DATE_STATUS': return !state
       default : return state
    }
}

export const dbDataReducer = (state={}, {type,payload}) => {
    switch (type) { 
        case 'GET_DB_DATA':
            return state = payload
        case 'GET_RE_DB_DATA':
            return state = payload
    
        default:
            return state
    }
}