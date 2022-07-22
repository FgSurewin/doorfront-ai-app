import { Typography, Container, TextField, Button } from '@mui/material'
import { Box } from '@mui/system';
import { useState } from 'react';
import { ReactToolAsideTitle } from "../General";


function handleChange (){
//    const [edit,setEdit] = useState(false);
}

export default function Notes() {

    return(
        <div>
        <ReactToolAsideTitle text="Notes" />
        <Container  >
        
        <TextField variant="standard" label='Store Name?' size='small' fullWidth id='name' disabled/>
        <TextField variant="standard" label='Store Address?' size = 'small' fullWidth id='address' disabled/>
        <TextField variant="standard" label='Accessible?' size = 'small' fullWidth disabled/>
        <TextField variant="standard" label='Handicap Restroom?' size = 'small' fullWidth disabled/>
        <Box sx={{pt:'5%',pl:'80%'}}>
        <Button size='small'>edit?</Button>
        </Box>

        </Container>
        </ div>
    )
}