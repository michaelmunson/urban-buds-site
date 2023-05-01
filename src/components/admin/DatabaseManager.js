import React, {useEffect, useState, useRef} from 'react';
import AdminNavBar from './AdminNavBar';
import {Radio, RadioGroup, FormControlLabel, FormLabel, Box, Modal, Button,FormControl, Select, MenuItem,TextField } from '@mui/material';
import DatabaseTable from './DatabaseTable';
import "./database-manager.css"
import DeleteIcon from '@mui/icons-material/Delete';
import DATA from "../../data.json";

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: "63%",
	maxWidth:"580px",
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	borderRadius:"20px",
	display:"flex",
	flexDirection: "column",
	maxHeight:"90%",
	overflow : "auto"
};

const {schema} = DATA;


export default function DatabaseManager({setPage}) {
	const priceInputRef = useRef(null);
	const [table, setTable] = useState("stores");
	const [storeData, setStoreData] = useState([]);
	const [productData, setProductData] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [dataInput, setDataInput] = useState({
		store_id : "",
		address : "",
		store_name : "",
		email : "",
		phone : "",
		contact_name : ""
	});
	const [numPriceInput, setNumPriceInput] = useState(1);
	const [lowPrices,setLowPrices] = useState([1]);
	const [addingData, setAddingData] = useState(false);
    const [checkedRows, setCheckedRows] = useState([]);
	const [version, setVersion] = useState(0)
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => {
		setModalOpen(false);
		setNumPriceInput(1);
		setLowPrices([1]);
	};

	useEffect(()=>{
		fetch("/api/get/liststores")
			.then(async res => setStoreData(await res.json()))
			.catch(err => console.error(err));

		fetch("/api/get/listproducts")
			.then(async res => setProductData(await res.json()))
			.catch(err => console.error(err));
	}, [version]);

	useEffect(()=>{
		const di = (table==="stores") 
		? {
			store_id : "",
			address : "",
			store_name : "",
			email : "",
			phone : "",
			contact_name : ""
		} 
		: {
			name : "",
			strain_type : "",
			inventory_type : "standard",
			prices : [],
			description : "",
			image_url : "",
			per : ""
		};
		setDataInput(di);
	},[table]);
	
	function handleAddPriceRow(){
		const inputs = priceInputRef.current.querySelectorAll("input");
		const inp = inputs[inputs.length - 2];
		if (!inp.value || !inputs[inputs.length - 1].value || isNaN(inp.value)) return;
		const lowPricesMut = lowPrices;
		lowPricesMut.push(parseInt(inp.value) + 1);
		setLowPrices(lowPricesMut);
		setNumPriceInput(numPriceInput+1);
	}

	function handleDataInput(key,value){
		const obj = {...dataInput}
		obj[key] = value;
		setDataInput(obj);
	}

	function handleAddData(){
		setAddingData(true);
		const urlPrefix = table.slice(0, table.length -1);
		const dataMut = dataInput;
		let error = false;

		if (table==="products"){
			const priceArr = [];
			let priceRow = {};
			priceInputRef.current.querySelectorAll("input").forEach((node,ind) => {
				ind = ind+1;
				if (node.value === "") error=true;
				
				const val = (isNaN(node.value)) ?
					(node.value === "+") 
						? -1 
						: node.value 
					: parseFloat(node.value)
				
				if (ind%3===1) priceRow.low = val;
				if (ind%3===2) priceRow.high = val;
				if (ind%3===0) {
					priceRow.price = val;
					priceArr.push(priceRow);
					priceRow = {};
				}
			});
			dataMut.prices = priceArr;
		}

		if (error) return;

		for (const key in dataInput){
			if (typeof dataInput[key] === "string" && dataInput[key]===""){
				return;
			}
		}

		fetch(`/api/create/${urlPrefix}`,{
			method: 'POST',
			body: JSON.stringify(dataMut),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			const result = (await res.json());
			console.log(result);
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
		console.log(checkedRows);
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
			setVersion(version+1);
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
					{/* <h2 style={{textAlign:"center",margin:5}}>{table[0].toUpperCase() + table.slice(1,table.length-1)} Input</h2> */}
					{
						(table === "stores") ? schema[table].map((input,i) => {
							return (
								<TextField id={input.id} label={input.label} type={input.type} variant="outlined" style={{margin:"10px"}} onBlur={e => handleDataInput(input.id, e.target.value)} key={`key${i}`}/>
							)
						})
						: 
						<>
							<FormControl style={{margin:"auto"}}>
								<RadioGroup
									row
									aria-labelledby="demo-radio-buttons-group-label"
									defaultValue="standard"
									name="radio-buttons-group"
								>
									<FormControlLabel value="standard" control={<Radio />} label="Standard" />
									<FormControlLabel value="soon" control={<Radio />} label="Coming Soon" />
									<FormControlLabel value="out" control={<Radio />} label="Out of Stock" />
								</RadioGroup>
							</FormControl>
							{/* <TextField label="Type" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("type", e.target.value)}/> */}
							<TextField label="Name" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("name", e.target.value)}/>
							<TextField label="Strain" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("strain_type", e.target.value)}/>
							<TextField label="Description" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("description", e.target.value)}/>
							<TextField label="Image URL" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("image_url", e.target.value)}/>
							
							
							<p style={{textAlign:"center",fontWeight:"bold"}}>Pricing</p>
							<TextField label="Per (unit)" type="text" variant="outlined" style={{margin:"5px"}} onChange={e => handleDataInput("per", e.target.value)}/>
							<div ref={priceInputRef}>
							{Array.from(Array(numPriceInput)).map((c, index) => {
								return <div style={{display:"flex",margin:"5px",justifyContent:"center"}} key={`key${index}`}>
									<TextField label="Low Range" type="text" variant="outlined" value={lowPrices[index]}/>
									<TextField label="High Range" type="text" variant="outlined"/>
									<TextField label="Price" type="number" variant="outlined"/>
								</div>
							})}
							</div>
							<Button onClick={handleAddPriceRow}>Add</Button>
						</>
					}
					<div style={{textAlign:"center",margin:"15px 0px 0px 0px"}}>
						<Button disabled={addingData} variant="contained" size='large' onClick={handleAddData}>Submit</Button>
					</div>
				</Box>
			</Modal>
		</>
  	)
}
