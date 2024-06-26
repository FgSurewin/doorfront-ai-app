import Navbar from "../../components/Navbar";
import {Container, Typography, Grid, Box, Paper} from "@mui/material";
import {getOpenRequests, RequestData} from "../../apis/request";
import {useEffect, useState, Fragment} from "react";
import {getAllUsersFromDB} from "../../apis/user";


export default function Request() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  useEffect(() => {
    async function fetchRequests() {
      const result = await getOpenRequests()
      console.log(result)
      setRequests(result.data)
    }

    fetchRequests();
  }, [])
  return (
    <div>
      <Navbar/>
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh" >
          <Paper elevation={3} sx={{p: 4, backgroundColor: "white", minWidth: "80%"}}>
            <Grid container rowSpacing={2} >
              <Grid item xs={3}><Typography sx={{fontWeight: "bold"}}>Requester</Typography></Grid>
              <Grid item xs={3}><Typography sx={{fontWeight: "bold"}}>Type</Typography></Grid>
              <Grid item xs={3}><Typography sx={{fontWeight: "bold"}}>Location</Typography></Grid>
              <Grid item xs={3}><Typography sx={{fontWeight: "bold"}}>Deadline</Typography></Grid>
              <Grid item xs={12}> <br/></Grid>
              {requests.map((request) => (
                <Fragment key={request.requestedBy + request.lon + request.lat}>
                  <Grid item xs={3} >
                    <Typography>{request.requestedBy}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{request.type}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>[ {request.lon}, {request.lat} ]</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{request.deadline.substring(5, 7)}/{request.deadline.substring(8, 10)}/{request.deadline.substring(0, 4)}</Typography>

                  </Grid>
                </Fragment>
              ))}
            </Grid>
          </Paper>
        </Box>
      </ Container>
    </div>
  )
}