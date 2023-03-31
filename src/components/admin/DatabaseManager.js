import React, {useEffect, useState} from 'react';
import AdminNavBar from './AdminNavBar';
import { Box, Modal, Button,FormControl, Select, MenuItem,TextField } from '@mui/material';
import DatabaseTable from './DatabaseTable';
import "./database-manager.css"
import { textAlign } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import DATA from "../../data.json";

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	borderRadius:"20px",
	display:"flex",
	flexDirection: "column",
};

const {schema} = DATA;


export default function DatabaseManager({setPage}) {
	const [table, setTable] = useState("stores");
	const [storeData, setStoreData] = useState([]);
	const [productData, setProductData] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [dataInput, setDataInput] = useState({});
	const [addingData, setAddingData] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => setModalOpen(false);

	useEffect(()=>{
		fetch("/api/get/liststores")
			.then(async res => setStoreData(await res.json()))
			.catch(err => console.error(err));

		fetch("/api/get/listproducts")
			.then(async res => setProductData(await res.json()))
			.catch(err => console.error(err));
	}, []);

	function handleDataInput(key,value){
		const obj = {...dataInput}
		obj[key] = value;
		setDataInput(obj);
	}

	function handleAddData(){
		setAddingData(true);
		const urlPrefix = table.slice(0, table.length -1);
		fetch(`/api/create/${urlPrefix}`,{
			method: 'POST',
			body: JSON.stringify(dataInput),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = (await res.json());
			if (table==="stores") setStoreData([...storeData, dataInput]);
			else setProductData([...productData, dataInput]);

			handleModalClose();
			setAddingData(false);
			setDataInput({});
		})
		.catch(err => console.error(err));
	}

	function handleRemoveData(){
		const urlPrefix = table.slice(0, table.length -1);
		fetch(`/api/remove/${urlPrefix}`,{
			method: 'POST',
			body: JSON.stringify({
				idArray:checkedRows,
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = (await res.json());
			window.location.reload();
			// const schemaID = schema[table][0].id;
			// const dataTable = (table==="stores")?storeData:productData;
			// const setDataFunc = (table==="stores")?setStoreData:setProductData;
			// let newData = dataTable;
			// for (const id of checkedRows){
			// 	newData = dataTable.filter(data => {
			// 		console.log(schemaID, data[schemaID] , id)
			// 		return data[schemaID] !== id
			// 	});
			// }
			// console.log(newData);
			// setDataFunc(newData);
			// setCheckedRows([]);
		})
		.catch(err => console.error(err));
	}
	
  	return (
    	<>
			<AdminNavBar pages={["Dashboard", "DB Manager"]} setPage={setPage}/>
			<div className='dbmanager-container'>
				<div className='dbmanager-head'>
					<FormControl sx={{ m: 1, minWidth: 120 }}>
						<Select
						value={table}
						onChange={e => setTable(e.target.value)}
						displayEmpty
						inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={"stores"}>Stores</MenuItem>
							<MenuItem value={"products"}>Products</MenuItem>
						</Select>
					</FormControl>
					<div>
						<Button size="large" disabled={checkedRows.length === 0} variant="text" onClick={handleRemoveData} color="error"><DeleteIcon/></Button>
						<Button variant="contained" size='large' onClick={handleModalOpen}>Add {table[0].toUpperCase() + table.slice(1,table.length-1)}</Button>
					</div>
				</div>
				<DatabaseTable columns={schema} table={table} data={(table==="stores")?storeData:productData} checkedRows={checkedRows} setCheckedRows={setCheckedRows}/>
			</div>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalStyle}>
					<h2 style={{textAlign:"center",margin:5}}>{table[0].toUpperCase() + table.slice(1,table.length-1)} Input</h2>
					{schema[table].map((input,i) => {
						return (
							<TextField id={input.id} label={input.label} type={input.type} variant="outlined" style={{margin:"10px"}} onBlur={e => handleDataInput(input.id, e.target.value)} key={`key${i}`}/>
						)
					})}
					<div style={{textAlign:"center",margin:"15px 0px 0px 0px"}}>
						<Button disabled={addingData} variant="contained" size='large' onClick={handleAddData}>Submit</Button>
					</div>
				</Box>
			</Modal>
		</>
  	)
}
