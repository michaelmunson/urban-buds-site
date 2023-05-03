import React, { useEffect,useState } from 'react';
import { PulseLoader } from 'react-spinners';
import "./utils.css";

export default function FullPageSpinner({loading, spinner=<PulseLoader color="#36d7b7"/>, backdropBlur=false, style={}, pointerEvents=true,}) {
    const [className,setClassName] = useState("fullpage-spinner");

    useEffect(()=>{
        setClassName(
            `fullpage-spinner ${(backdropBlur)?"blur":""} ${(!pointerEvents)?"no-pointer-events":""}`
        );
    },[])


    if (loading) return (
        <div className={className} style={style}>
            {spinner}
        </div>
    )

    return (<></>)
}
