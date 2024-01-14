/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from "react-router-dom";
import './Header.css';
import banner from '../../assets/img/Banner-opt.jpg';

const Header = () => {
	return (
		<div className="Header">
			<Link to="/">
				<img src={banner} alt="Banner logo" width={300} />
			</Link>
		</div>
	);
};

export default Header
