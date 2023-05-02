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
import { FormControl,RadioGroup,FormControlLabel,Radio} from '@mui/material';
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
		display: true,
		text: "Website Views"
	  }
	}
};

export default function Dashboard({setPage}) {
	const [dashboardPage, setDashboardPage] = useState("charts");
	const [viewOption, setViewOption] = useState("day");
	const [stats, setStats] = useState({
		views : {
			day : {
				labels : ["0:00","3:00","6:00","9:00","12:00","15:00","18:00","21:00"],
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
			month : {},
			year : {},
		},
		orders : {
			day : {},
			week : {},
			month : {},
			year : {},
		}
	});
	const [version, setVersion] = useState(0);
	const newVersion = () => setVersion(version+1);

	useEffect(()=>{
		formatStats()	
			.then(res => {
				console.log(res);
				setStats(res);
				newVersion();
			});
	},[]);

	if (dashboardPage === "charts") return (
    	<>
			<AdminNavBar pages={["Dashboard", "DB Manager"]} setPage={setPage}/>
			<div className='charts-container'>
				<div className='chart-section'>
					<Line options={options} data={stats.views[viewOption]}/>
					<FormControl>
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
					</FormControl>
				</div>
			</div>
		</>
  	)

}
