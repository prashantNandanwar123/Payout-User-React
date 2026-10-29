import { useEffect, useState } from "react";
import { stopTags, typeNumber } from "../assets/customValidation";

export const Label = (props) => {
    return (
        <label htmlFor={props.for} className="form-label fw-bold text-secondary form_label">{props.name} 
            {props.req ? <span className="text-danger fw-bold"> *</span> : ''}
        </label>
    )
}

export const Input = ({register,id,name,req,errors,minLen,maxLen,onInput,regex,focus,css,read,val}) => {
    return (<>
        <input type="text" className={`form-control shadow-none ${css}`} value={val} id={id} onInput={onInput} maxLength={maxLen} autoFocus={focus} readOnly={read}
        {...register(name, {required: {value:req, message:'This is a required field'}, pattern:regex.pattern, 
        minLength: {value:minLen, message:'Please enter valid input'}, maxLength:maxLen})} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

// export const MatchInput = ({register,id,req,errors,maxLen,compare,onInput}) => {
//     return (<>
//         <input type="text" className="form-control shadow-none" id={id} maxLength={maxLen} onInput={onInput}
//         {...register(id, {required: {value:req, message:'This is a required field'}, validate: value => value === compare.acNo })} />
//         <strong className="text-danger inpErr">
//             {errors && errors.message}
//             {errors && errors.type === "validate" && "This value is not matched"}
//         </strong>
//     </>)
// }

export const SelectInput = ({register,id,req,option,regex,name,onInput}) => {
    return (
        <select className="form-select shadow-none" id={id} {...register(name, 
        { required: req, pattern:regex.pattern})} onInput={onInput}>
            {option.map(val => <option key={val} value={val}> {val} </option> )}
        </select>
    )
}

export const TextArea = ({register,id,req,errors,minLen,maxLen,onInput,regex,name}) => {
    return (<>
        <textarea type="text" className="form-control shadow-none" id={id} onInput={onInput} maxLength={maxLen}
        {...register(name, {required: {value: req, message:'This is a required field'}, pattern:regex.pattern, minLength:minLen, maxLength:maxLen})} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

export const FileInput = ({register,errors,req,id,name}) => {
    const uploadFile = (e) => {
        let disErr = document.querySelector('#'+e.target.id+'+strong');
        let file = e.target.files[0];
        if(file){
            let ext = file.name.split('.').pop();
            let size = Math.floor(file.size/1024);
            if((ext === 'png' || ext === 'jpg' || ext === 'pdf') && size < 1000){
                disErr.textContent = '';
            }else{
                e.target.value = '';
                disErr.textContent = 'Please upload jpg / png / pdf with size less than 1000 kb';
            }
        }
    }
    return (<>
        <input type="file" className="form-control shadow-none" id={id} onInput={uploadFile}
        {...register(name, {required: {value:req, message:'Please upload jpg / png / pdf with size less than 1000 kb'}})} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

export const OTPInput = ({register,otpBox}) => {

    useEffect(() => {
        let i = 1;
        while(i <= otpBox){
            document.getElementById(`otp_${i}`).value = '';
            i++;
        }
        document.querySelector('.otp-inp').focus();
    },[otpBox])

    const otpHandler = (e,nextId) => {
        let elem = e.target;
        if(elem.value.length >= elem.maxLength && elem.dataset.uid < otpBox){
            document.getElementById(nextId).focus();
        }
    } 

    return (<>
        {[...Array(otpBox)].map((x, i) =>
            <input key={i} data-uid={i+1} type="text" id={`otp_${i+1}`} className="form-control me-3 otp-inp" maxLength={1} onInput={typeNumber}
            onKeyUp={e => otpHandler(e,`otp_${i+2}`)} {...register(`otp${i+1}`,{required:true, maxLength:1})} />
        )}
    </>)
}

export const RadioInput = ({register,radioName,name,val,id,checked}) => {
    return (
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" id={id}
            value={val} {...register(name, {required: true})} onInput={stopTags} defaultChecked={checked} />
            <label className="form-check-label" htmlFor={id}>{radioName}</label>
        </div>
    )
}

export const SelectInputEvent = ({register,id,req,option,regex,name,changeHandler}) => {
    
    return (
        <select className="form-select shadow-none" id={id} onChange={changeHandler}
        {...register(name, { required: req, pattern:regex.pattern})}>
            {option.map(val => <option key={val} value={val}> {val} </option> )}
        </select>
    )
}

export const InputPswd = ({register,id,name,req,errors,minLen,maxLen,onInput,regex,focus,css,read,val}) => {
    return (<>
        <input type="password" className={`form-control shadow-none ${css}`} value={val} id={id} onInput={onInput} maxLength={maxLen} autoFocus={focus} readOnly={read}
        {...register(name, {required: {value:req, message:'This is a required field'}, pattern:regex.pattern, 
        minLength: {value:minLen, message:'Password must be at least 8 characters long.'}, maxLength:maxLen})} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

export const InputPsd = ({ register, id, name, req, errors, minLen, maxLen, onInput, regex, focus, css, read, val }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="password-input-container" style={{ position: 'relative' }}>
            <input
                type={showPassword ? "text" : "password"}
                className={`form-control shadow-none ${css}`}
                value={val}
                id={id}
                onInput={onInput}
                maxLength={maxLen}
                autoFocus={focus}
                readOnly={read}
                {...register(name, {
                    required: { value: req, message: 'This is a required field' },
                    pattern: regex?.pattern,
                    minLength: { value: minLen, message: 'Please enter valid input' },
                    maxLength: maxLen
                })}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
            
                {!showPassword ? <i class="bi bi-eye-slash-fill"></i> : <i class="bi bi-eye-fill"></i>}
            </button>
            <strong className="text-danger inpErr">{errors && errors.message}</strong>
        </div>
    );
};