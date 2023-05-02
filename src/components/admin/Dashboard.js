import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import { getStats, formatStats} from '../../utils/stats';
import {Line} from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
  } from "chart.js";
import { FormControl,RadioGroup,FormControlLabel,Radio, Select, MenuItem,InputLabel, Menu} from '@mui/material';
import "./dashboard.css";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	plugins: {
	  legend: {
		position: "top"
	  },
	  title: {
		display: false,
		text: "Website Views"
	  }
	}
};

const titleMap = {
	day : "Today",
	week : "This Week",
	month : "This Month",
	year : "This Year"
}

export default function Dashboard({setPage}) {
	const [dashboardPage, setDashboardPage] = useState("charts");
	const [chartOption, setChartOption] = useState("views");
	const [viewOption, setViewOption] = useState("week");
	const [ordersOption, setOrdersOption] = useState("week");
	const [stats, setStats] = useState({
	views : {
		day : {
			labels : ["0:00","3:00","6:00","9:00","12:00","15:00","18:00","21:00","23:59"],
			datasets : [
				{
					label : "Unique Views",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				},
				{
					label : "Total Views",
					data : [],
					borderColor : "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)"
				}
			]
		},
		week : {
			labels : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
			datasets : [
				{
					label : "Unique Views",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				},
				{
					label : "Total Views",
					data : [],
					borderColor : "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)"
				}
			]
		},
		month : {
			labels : ["Week 1","Week 2","Week 3","Week 4","Week 5"],
			datasets : [
				{
					label : "Unique Views",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				},
				{
					label : "Total Views",
					data : [],
					borderColor : "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)"
				}
			]
		},
		year : {
			labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
			datasets : [
				{
					label : "Unique Views",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				},
				{
					label : "Total Views",
					data : [],
					borderColor : "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)"
				}
			]
		},
	},
	orders : {
		day : {
			labels : ["0:00","3:00","6:00","9:00","12:00","15:00","18:00","21:00","23:59"],
			datasets : [
				{
					label : "Orders",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				}
			]
		},
		week : {
			labels : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
			datasets : [
				{
					label : "Orders",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				}
			]
		},
		month : {
			labels : ["Week 1","Week 2","Week 3","Week 4","Week 5"],
			datasets : [
				{
					label : "Orders",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				}
			]
		},
		year : {
			labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
			datasets : [
				{
					label : "Orders",
					data : [],
					borderColor : "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				}
			]
		},
	}});
	const [version, setVersion] = useState(0);
	const newVersion = () => setVersion(version+1);

	useEffect(()=>{
		formatStats()	
			.then(res => {
				setStats(res);
				newVersion();
			});
	},[]);

	if (dashboardPage === "charts") return (
    	<div>
			<AdminNavBar pages={["Dashboard", "DB Manager"]} setPage={setPage}/>
			<div className='charts-container'>
				<div className='chart-section'>
					<div style={{display:"flex",alignItems:"center", justifyContent:"center"}}>
						{/* <FormControl variant='standard'>
							<Select
								value={chartOption}
								onChange={e => setChartOption(e.target.value)}
							>
								<MenuItem value={"views"}>Website Views</MenuItem>
								<MenuItem value={"orders"}>Orders</MenuItem>
							</Select>
						</FormControl> */}
						<h3 className='chart-header'>Website Views </h3>
						<FormControl variant='standard'>
							<Select
								value={viewOption}
								onChange={e => setViewOption(e.target.value)}
							>
								<MenuItem value={"day"}>Today</MenuItem>
								<MenuItem value={"week"}>This Week</MenuItem>
								<MenuItem value={"month"}>This Month</MenuItem>
								<MenuItem value={"year"}>This Year</MenuItem>
							</Select>
						</FormControl>
						{/* <FormControl>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							defaultValue="day"
							onChange={(e)=>setViewOption(e.target.value)}
						>
							<FormControlLabel value="day" control={<Radio/>} label="Day" />
							<FormControlLabel value="week" control={<Radio/>} label="Week" />
							<FormControlLabel value="month" control={<Radio/>} label="Month" />
							<FormControlLabel value="year" control={<Radio/>} label="Year" />
						</RadioGroup>
						</FormControl> */}
					</div>
					<Line options={options} data={stats.views[viewOption]} style={{width:"80%"}}/>
				</div>
				
				<div className='chart-section'>
					<div style={{display:"flex",alignItems:"center", justifyContent:"center"}}>
						{/* <FormControl variant='standard'>
							<Select
								value={chartOption}
								onChange={e => setChartOption(e.target.value)}
							>
								<MenuItem value={"views"}>Website Views</MenuItem>
								<MenuItem value={"orders"}>Orders</MenuItem>
							</Select>
						</FormControl> */}
						<h3 className='chart-header'>Orders</h3>
						<FormControl variant='standard'>
							<Select
								value={ordersOption}
								onChange={e => setOrdersOption(e.target.value)}
							>
								<MenuItem value={"day"}>Today</MenuItem>
								<MenuItem value={"week"}>This Week</MenuItem>
								<MenuItem value={"month"}>This Month</MenuItem>
								<MenuItem value={"year"}>This Year</MenuItem>
							</Select>
						</FormControl>
						{/* <FormControl>
						<RadioGroup
							row
							aria-labelledby="demo-row-radio-buttons-group-label"
							name="row-radio-buttons-group"
							defaultValue="day"
							onChange={(e)=>setViewOption(e.target.value)}
						>
							<FormControlLabel value="day" control={<Radio/>} label="Day" />
							<FormControlLabel value="week" control={<Radio/>} label="Week" />
							<FormControlLabel value="month" control={<Radio/>} label="Month" />
							<FormControlLabel value="year" control={<Radio/>} label="Year" />
						</RadioGroup>
						</FormControl> */}
					</div>
					<Line options={options} data={stats.orders[ordersOption]} style={{width:"80%"}}/>
				</div>
			</div>
		</div>
  	)

}
