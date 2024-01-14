/* eslint-disable no-unused-vars */
import React from "react";
import ListProduct from '../../components/ListProduct/ListProduct';

const styles = {
	containerHome: {
		textAlign: "center",
		paddingTop: 20,
	},
};

const HomePage = () => {
    return (
        <div style={styles.containerHome}>
            <h2>Home Page</h2>
            <ListProduct />
        </div>
    );
};

export default HomePage;