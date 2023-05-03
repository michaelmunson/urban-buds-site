import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminAuth } from '../../utils/auth';
import Dashboard from './AdminStats';
import DatabaseManager from './DatabaseManager';

export default function Admin() {
	const navigate = useNavigate();
	const [page, setPage] = useState("Dashboard");

	useEffect(()=>{
		if (!isAdminAuth()){
			navigate("/login");
		}
		navigate("/admin/dashboard");
	},[]);
}
