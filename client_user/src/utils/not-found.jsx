import { Button, Result } from 'antd';
import React from 'react'
import { Link } from "react-router-dom";


const NotFound = () => (
    <Result //antd component
        status="404"
        title="404"
        subTitle="Ooops, This page does not exist"
        extra={
            <Link to="/">
                <Button
                    type="primary"
                    style={{
                        backgroundColor: "#1D5FAD",
                        fontSize: "16px",
                        height: "50px",
                        width: "170px",
                    }}
                    size="large"
                >
                    Back Home
                </Button>
            </Link>
        }
    />
);


export default NotFound;
