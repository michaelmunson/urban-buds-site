import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { Button, Checkbox, FormControl, Link, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import date from "date-and-time";
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import FullPageSpinner from '../utils/FullPageSpinner';
import AdminNavBar from './AdminNavBar';
import "./dashboard.css";


const statusMap = {
	pending : "Pending",
	fulfilled : "Fulfilled"
}

export default function Dashboard() {
	const [loading,setLoading] = useState(true);
	const [statusLoading,setStatusLoading] = useState(false);
	const [table,setTable] = useState("pending")
	const [orderData, setOrderData] = useState([]);
	const [relOrderData, setRelOrderData] = useState([]);
	const [version,setVersion] = useState(0);
	const newVersion = () => setVersion(version+1);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [popoverTableData, setPopoverTableData] = useState({headers:[],data:[]});
	const [checkedRows, setCheckedRows] = useState([]);
	const handleClose = () => setAnchorEl(null);
	const handleChangePage = (event, newPage) => setPage(newPage);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClick = (event,type,data) => {
		const tableData = {
			headers : [],
			data : []
		};

		if (type === "store"){
			tableData.headers = ["Store Name","Address","Phone"]
			tableData.data.push([data.store_name, data.address, data.phone])
		}

		if (type === "order"){
			tableData.headers = ["Name", "Quantity"]
			for (const order of data){
				tableData.data.push([order.name, `${order.quantity}`]);
			}
		}

		setPopoverTableData(tableData);
		newVersion();
		setAnchorEl(event.currentTarget)
	};
	const open = Boolean(anchorEl);
  	const id = open ? 'simple-popover' : undefined;

	useEffect(()=>{
		fetch("/api/get/orders")
			.then(async res => {
				const resjson = await res.json();
				const {orders} = resjson
				const sortedOrders = orders.sort(function(x,y){
					return y.timestamp - x.timestamp
				});
				setOrderData(sortedOrders);
				setLoading(false);

				// setTimeout(()=>{
				// },5000)
			})
			.catch(err => console.error(err));
	},[]);

	useEffect(()=>{
		if (table==="pending"){
			setRelOrderData(orderData.filter(order => !order.fulfilled))
		}
		else setRelOrderData(orderData.filter(order => order.fulfilled));
		newVersion();
	},[table,version]);

	function handleCheckRow(event,rowId){
		if (event.target.checked){
			const checked = [...checkedRows, rowId];
			setCheckedRows(checked);
		}
		else {
			const checked = checkedRows.filter(row => row !== rowId);
			console.log(checked);
			setCheckedRows(checked);
		}
		newVersion();
	}

	function handleChangeStatus(){
		setStatusLoading(true)
		const orderDataMut = orderData;
		for (const id of checkedRows){
			for (const i in orderDataMut){
				if (orderDataMut[i].orderId === id){
					orderDataMut[i].fulfilled = !orderDataMut[i].fulfilled
				}
			}
		}
		setOrderData(orderDataMut);
		setCheckedRows([]);
		newVersion();
		

		fetch("/api/order/setstatus", {
			method: 'POST',
			body: JSON.stringify({
				orderIds : checkedRows,
				status : (table === "pending")
			}),
			headers: {
			  'Content-type': 'application/json; charset=UTF-8',
			}
		})
		.then(async res => {
			setStatusLoading(false)
		})
		.catch(err => console.error(err));
	}
	
	return (
		<div>
			<AdminNavBar/>
			<div className='dashboard-container'>
				<div className='dashboard-header'>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<Select
							value={table}
							onChange={e => {
								setTable(e.target.value);
								setCheckedRows([]);
							}}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
							>
								<MenuItem value={"pending"}>Pending</MenuItem>
								<MenuItem value={"fulfilled"}>Fulfilled</MenuItem>
							</Select>
						</FormControl>
						<h2>{table[0].toUpperCase() + table.slice(1)} Orders</h2>
						<div>
							<Button size="large" disabled={checkedRows.length < 1} variant="text" onClick={handleChangeStatus} color={(table==="pending")?"success":"error"}>
								{(statusLoading)
								? <PuffLoader color="black" size={24}/>
								: (table==="pending")
									? <CheckCircleIcon fontSize='large'/>
									: <UnpublishedIcon fontSize='large'/>
								}
							</Button>
						</div>
				</div>
				<div className='table-container'>
					{(relOrderData.length > 0)
						? <Paper sx={{ width: '100%', overflow: 'hidden', border:"1px solid black", marginTop:"20px" }}>
							<TableContainer sx={{ maxHeight: 440 }}>
								<Table stickyHeader aria-label="sticky table">
								<TableHead>
									<TableRow>
										<TableCell width={30}></TableCell>
										<TableCell align='center' component="th" scope="row">Order ID</TableCell>
										<TableCell align='center'>Store Code</TableCell>
										<TableCell align='center'>Date</TableCell>
										<TableCell align='center'>Time</TableCell>
										<TableCell align='center'>Order</TableCell>
										<TableCell align='center'>Total</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{
									relOrderData
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row,index) => (
										<TableRow
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
												key={row.orderId}
											>
												<TableCell>
													<Checkbox onChange={e => handleCheckRow(e,row.orderId)}/>
												</TableCell>
												<TableCell align='center' component="th" scope="row">{row.orderId}</TableCell>
												<TableCell align='center'>
													<Link href="#" onClick={(e)=>{handleClick(e, "store", row.storeDetails); }}>{row.storeDetails.store_id}</Link>
												</TableCell>
												<TableCell align='center'>{date.format(new Date(row.timestamp),"MM/DD/YYYY")}</TableCell>
												<TableCell align='center'>{date.format(new Date(row.timestamp),"hh:mm:ss A")}</TableCell>
												<TableCell align='center'>
													<Link href="#" onClick={(e)=>{handleClick(e, "order", row.order); }}>{row.order.length} items</Link>
												</TableCell>
												<TableCell align='center'>${row.total}</TableCell>
										</TableRow>
									))
								}
										
										
									
								</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[10, 25, 100]}
								component="div"
								count={orderData.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Paper>
						: <h2 style={{textAlign:"center",color:"gray",marginTop:"60px"}}>No {statusMap[table]} Orders</h2>
					}
				</div>
			</div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
				}}
			>
				<div style={{border:"2px solid black", borderRadius:"5px"}}>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
						<TableRow>
							{popoverTableData.headers.map((row,index) => (
								<TableCell key={`key${index}`} align="center">{row}</TableCell>
							))}
						</TableRow>
						</TableHead>
						<TableBody>
							{popoverTableData.data.map((row, index) => (
								<TableRow
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								key={`key${index}`}
								>
									{row.map((dd,i) => (
										<TableCell key={`key${i}`} align='center'>{dd}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				</div>
				
			</Popover>
			<FullPageSpinner loading={loading} backdropBlur={true}/>
		</div>
	)
}
