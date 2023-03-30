import React, {useEffect, useState} from 'react';
import Dashboard from './Dashboard';
import DatabaseManager from './DatabaseManager';
import { isAdminAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import Login from '../Login';

export default function Admin() {
	const navigate = useNavigate();
	const [page, setPage] = useState("DB Manager");

	useEffect(()=>{
		if (!isAdminAuth()){
			navigate("/login");
		}
	},[])

  	if (page==="Dashboard") {
		return <Dashboard setPage={setPage}/>
	}
	if (page==="DB Manager") {
		return <DatabaseManager setPage={setPage}/>
	}

}
