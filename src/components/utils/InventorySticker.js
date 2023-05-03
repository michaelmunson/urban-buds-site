import React, { useEffect,useState } from 'react';
import "./utils.css";

export default function InventorySticker({type}) {
    const typeMap = {
        soon : "COMING SOON",
        out : "SOLD OUT",
    }

    if (type==="standard") return <></>
    
    return (
        <div className='inventory-sticker'>
            {typeMap[type]}
        </div>
    )
}