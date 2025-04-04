"use client"
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelImporter = () => {
    const [data, setData] = useState([]);
    const [file, setfile] = useState()
    // const handleFileUpload = (event) => {
    //     setfile(event.target.files[0])
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const arrayBuffer = e.target.result;
    //         const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //         setData(jsonData);
    //     };
    //     reader.readAsArrayBuffer(file);

        
    // };

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader()
        console.log(e.target.files);
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        console.log(e.target.files![0].type,"e.target");
        const file = e.target.files![0]
        reader.onloadend = (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setData(jsonData);
        }
        if (file) {
            setfile(file)
            reader.readAsArrayBuffer(file);
        }
    }

    useEffect(()=>{
console.log("data",data);

    },[data])
    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ExcelImporter;