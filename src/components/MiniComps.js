import { useEffect, useState } from "react"
import { sortDate } from "../assets/functions";
import { useSelector } from "react-redux";

export const CountDown = (props) => {

    const { minutes, seconds, reSend, otpReset } = props;
    const [min, setMin] = useState(minutes);
    const [sec, setSec] = useState(seconds);

    useEffect(() => {
        let cdInterval = setInterval(() => {
            if (min === 0 && sec === 0) reSend(false);
            if (sec > 0) setSec(sec - 1);
            if (sec === 0) {
                if (min === 0) clearInterval(cdInterval)
                else {
                    setMin(min - 1);
                    setSec(59);
                }
            }
        }, 1000)
        return () => clearInterval(cdInterval);
    }, [min, sec, reSend]);

    useEffect(()=>{
        setMin(minutes);
        setSec(seconds);
    },[otpReset])

    return (<>
        {min === 0 && sec === 0 ? null :
            <>{min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}</>
        }
    </>)
}

export const DateInput = ({ dateRef }) => {

    const dateStatus = useSelector(state => state.dateStatus)

    useEffect(()=> {
        let date = sortDate(new Date())
        dateRef.current.value = date;
        dateRef.current.parentElement.querySelector('input[type=date]').value = "";
    },[dateStatus])

    const changeHandler = (e) => {
        let currentDate = e.target.parentElement.querySelector('input[type=date]')
        currentDate.showPicker();
    }
    const selectDate = (e) => {
        let dateInput = e.target.parentElement.querySelector('input[type=text]');
        let date = new Date(e.target.value);
        let actualDate = sortDate(date);
        dateInput.value = actualDate;
        dateRef.current.value = actualDate;
    }
    return (<>
        <div className="input-group input-group-sm date-input">
            <input type="date" className="position-absolute bottom-0 border-0" style={{ width: 0, height: 0 }} onChange={selectDate} />
            <span className="input-group-text">
                <i className="bi bi-calendar"></i>
            </span>
            <input type="text" className="form-control shadow-none" ref={dateRef} onClick={changeHandler} />
        </div>
    </>)
}

export const LegendInput = ({label,val}) => {
    return (
        <fieldset className="border px-2 pb-2 field-inp">
            <legend className="float-none w-auto px-2 mb-0 text-success">{label}</legend>
            <input type="text" className="form-control border-0 px-2 py-0 shadow-none" defaultValue={val} readOnly />
        </fieldset>
    )
}

export const CheckInput = ({id,val,label,change}) => {
    return (
        <div className="form-check">
            <input className="form-check-input" type="radio" name="checkFilter" id={id} value={val} onChange={change} /> 
            <label className="form-check-label" htmlFor={id}>{label}</label>
        </div>
    )
}