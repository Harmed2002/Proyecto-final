/* eslint-disable no-unused-vars */
import React from "react";
import ListProduct from '../../components/ListProduct/ListProduct';
import NavBar from '../../components/NavBar/NavBar';

const styles = {
	containerHome: {
		textAlign: "center",
		paddingTop: 20,
	},
};

const HomePage = () => {
    return (
        <div style={styles.containerHome}>
            <NavBar />
            <h2>Home Page</h2>
            <ListProduct />
        </div>
    );
};

export default HomePage;