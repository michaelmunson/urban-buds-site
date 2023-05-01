import React, { useEffect, useState } from 'react'
import AdminNavBar from './AdminNavBar'
import { getStats } from '../../utils/stats';

export default function Dashboard({setPage}) {
	const [stats, setStats] = useState({});
	const [version, setVersion] = useState(0);
	const newVersion = () => setVersion(version+1);

	useEffect(()=>{
		getStats()	
			.then(res => {
				console.log(res);
				setStats(res);
				newVersion();
			});
	},[]);


  	return (
    	<>
			<AdminNavBar pages={["Dashboard", "DB Manager"]} setPage={setPage}/>
			Dashboard
		</>
  	)
}
