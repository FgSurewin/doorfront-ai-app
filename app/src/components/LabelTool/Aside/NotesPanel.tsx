import React from 'react';
// import { Typography, Container, TextField, Button } from '@mui/material'
// import { Box } from '@mui/system';
// import { useState } from 'react';
import { ReactToolAsideTitle } from "../General";
import Notes from "../../Notes"


// function handleChange (){
// //    const [edit,setEdit] = useState(false);
// }

export default function NotesPanel({page,id}:{
    page:string;
    id:string;
}) {
    return(
        <>
        <ReactToolAsideTitle text="Notes" />
        <Notes page={page} id={id}/>
        </>
    )
}


