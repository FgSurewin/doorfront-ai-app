import Navbar from "../../components/Navbar";
import {Container, Typography, Grid, Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {getOpenRequests, RequestData} from "../../apis/request";
import {useEffect, useState, Fragment} from "react";
import {getNickname} from "../../apis/user";
import {fromAddress, setKey} from "react-geocode";
import {useNavigate} from "react-router-dom";
import {useExplorationStore} from "../../global/explorationState";
import {useSnackbar} from "notistack";


export default function Request() {
  interface userIdMap {
    id: string,
    username:string
  }
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [userNames,setUserNames] = useState<userIdMap[]>([])
  const {updateClickedLocation, updateGoogleMapConfig} = useExplorationStore();
  const {enqueueSnackbar} = useSnackbar();


  useEffect(() => {
    async function fetchRequests() {
      const result = await getOpenRequests()
      // console.log(result)
      if(result.data) setRequests(result.data)
    }

    fetchRequests();
  }, [])

  const navigate = useNavigate();

  useEffect(()=>{
    async function fetchUserNames(){
      for(const request of requests){
        const userId = request.requestedBy
        let found = false
        for(const user of userNames){
          if(user.id === request.requestedBy){
            found = true
            //console.log(`found ${user.username}`)
          }
        }
        if(!found){
          const result = await getNickname({id:userId})
          if(result.data){
            //console.log(result)
            setUserNames((userNames)=> [...userNames, {id: userId, username: result.data}])
          }
        }
      }
    }
    fetchUserNames()
  },[requests])

  function getUserName(userId:string){
    for(const user of userNames){
      if(user.id === userId) return user.username
    }
  }

  function deadlineString(request: RequestData){
    const string = request.deadline.toString()
    return `${string.substring(5, 7)}/${string.substring(8, 10)}/${string.substring(0, 4)}`
  }
  setKey(process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY as string)



  function handleClick(address:string){
    fromAddress(address)
      .then(({ results }) => {
        const { lat, lng } = results[0].geometry.location;
        if(results){
          updateGoogleMapConfig({
            position: {
              lat,
              lng
            }
          })
          updateClickedLocation({
            lat,
            lng
          });
          navigate("/exploration")
        }
      })
      .catch((error)=>{
        console.error(error);
        enqueueSnackbar("The location is not a valid address!", {variant: "error"});
      });
  }
  const style = {
    typography: {xs: '5px'},
    fontWeight: "bold"
  }

  const font = {xs:10, s:12, lg:20}
  return (
    <div>
      <Navbar/>
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh" >
          <Paper elevation={3} sx={{p: 4, backgroundColor: "white", overflowX: "auto", minWidth:"60vw"}}>
            <Table aria-label={"Requests"}>
              <TableHead >
                <TableRow >
                  <TableCell sx={{fontWeight: "bold"}}> Requester </TableCell>
                  <TableCell sx={{fontWeight: "bold"}}> Type </TableCell>
                  <TableCell sx={{fontWeight: "bold"}}> Location </TableCell>
                  <TableCell sx={{fontWeight: "bold"}}> Deadline </TableCell>
                  <TableCell sx={{fontWeight: "bold"}}> Fulfill </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.requestedBy + request.address}>
                    <TableCell>{getUserName(request.requestedBy)}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.address}</TableCell>
                    <TableCell>{deadlineString(request)}</TableCell>
                    <TableCell><Button sx={{mt:-1}}  onClick={()=>handleClick(request.address)} variant="contained" size={"small"}>Explore</Button></TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/*<Grid container rowSpacing={2}  >*/}
            {/*  <Grid item xs={12/5}><Typography sx={{fontWeight: "bold"}} fontSize={font}>Requester</Typography></Grid>*/}
            {/*  <Grid item xs={12/5}><Typography sx={{fontWeight: "bold"}} fontSize={font}>Type</Typography></Grid>*/}
            {/*  <Grid item xs={12/5}><Typography sx={{fontWeight: "bold"}} fontSize={font}>Location</Typography></Grid>*/}
            {/*  <Grid item xs={12/5}><Typography sx={{fontWeight: "bold"}} fontSize={font}>Deadline</Typography></Grid>*/}
            {/*  <Grid item xs={12/5}><Typography sx={{fontWeight: "bold"}} fontSize={font}>Complete Request</Typography></Grid>*/}

            {/*  <Grid item xs={12}> <br/></Grid>*/}
            {/*  {requests.map((request) => (*/}
            {/*    <Fragment key={request.requestedBy + request.address}>*/}
            {/*      <Grid item xs={12/5} >*/}
            {/*        <Typography fontSize={font}>{getUserName(request.requestedBy)}</Typography>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={12/5}>*/}
            {/*        <Typography fontSize={font}>{request.type}</Typography>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={12/5}>*/}
            {/*        <Typography fontSize={font}>{request.address}</Typography>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={12/5}>*/}
            {/*        <Typography fontSize={font}>{deadlineString(request)}</Typography>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={12/5}>*/}
            {/*        <Button sx={{mt:-1}}  onClick={()=>handleClick(request.address)} variant="contained" size={"small"}>Explore</Button>*/}
            {/*      </Grid>*/}
            {/*    </Fragment>*/}
            {/*  ))}*/}
            {/*</Grid>*/}
          </Paper>
        </Box>
      </ Container>

    </div>
  )
}