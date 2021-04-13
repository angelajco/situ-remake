import React, { useState } from "react";

const Aaa = React.memo(() => {

    console.log("padre aaa");

    const Total = React.memo((props) => {
        console.log(props);
        return (
            <div>hola345</div>
        )
    })


    return (
        <>
            <Total/>
            <p>hola</p>
        </>
    )
});

export default Aaa