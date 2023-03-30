import React from 'react'
import AdminNavBar from './AdminNavBar'

export default function Dashboard({setPage}) {

  	return (
    	<>
			<AdminNavBar pages={["Dashboard", "DB Manager"]} setPage={setPage}/>
			Dashboard
		</>
  	)
}
