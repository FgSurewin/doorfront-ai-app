import {addRequest} from "../../apis/request";
import Navbar from "../../components/Navbar";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField
} from "@mui/material";
import {useState, useEffect} from "react";
import Button from "@mui/material/Button";
// import {useUserStore} from "../../global/userState";
import {ArrowForwardIos, ArrowBackIos} from '@mui/icons-material';
import {useUserStore} from "../../global/userState";
import { useSnackbar } from "notistack";
import {fromAddress, setKey} from "react-geocode";
import { LocationType } from "../../global/explorationState";
import {useNavigate} from "react-router-dom";

export default function CreateRequest() {
  // const deadlines = [2, 3, 4, 5];
  // const {userInfo} = useUserStore();
  const [forward, setForward] = useState(true);
  const [backward, setBackward] = useState(true);
  const [currentStep, setCurrentStep] = useState(0)
  const baseData = {address: "", type: "", deadline: 0}
  const [requestData, setRequestData] = useState(baseData)
  const [retry, setRetry] = useState('block')
  const [location, setLocation] = useState<LocationType>({lat: 0, lng: 0})
  const [addressWrong,setAddressWrong] = useState(false)

  const {userInfo} = useUserStore()
  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate();
  setKey(process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY as string)

  async function fetchAddress(){
    try{
      console.log(requestData.address);
      const res = await fromAddress(requestData.address)
      if(res){
        console.log(res)
        const { lat, lng } = res.results[0].geometry.location;
        console.log(lat, lng);
        setLocation(res.results[0].geometry.location)
        setCurrentStep(currentStep +1)
      }
    } catch(e){
      console.error(e)
      setAddressWrong(true)
      setForward(true)
    }

  }
  // useEffect(()=>{
  //   async function fetchAddress(){
  //     try{
  //       console.log(requestData.address);
  //       const res = await fromAddress(requestData.address)
  //       if(res){
  //         console.log(res)
  //         const { lat, lng } = res.results[0].geometry.location;
  //         console.log(lat, lng);
  //         setLocation(res.results[0].geometry.location)
  //       }
  //     } catch(e){
  //       console.error(e)
  //       setAddressWrong(true)
  //       setForward(false)
  //     }
  //
  //   }
  //   if(currentStep === 1)
  //    fetchAddress()
  //   // fromAddress(requestData.address)
  //   //   .then(({ results }) => {
  //   //     const { lat, lng } = results[0].geometry.location;
  //   //     console.log(lat, lng);
  //   //     setLocation(results[0].geometry.location)
  //   //   })
  //   //   .catch(console.error);
  // },[currentStep])

  // const placesLibrary = useMapsLibrary("places");
  // console.log(placesLibrary)
  // const [service, setService] = useState<any>(null);
  // const [results, setResults] = useState<any>([]);
  // const [hoveredIndex, setHoveredIndex] = useState(null);
  //
  // useEffect(() => {
  //   if (placesLibrary) {
  //     setService(new placesLibrary.AutocompleteService());
  //   } else {
  //     setService(null);
  //   }
  // }, [placesLibrary]);
  //
  // const updateResults = () => {
  //   if (!service || requestData.address.length === 0) {
  //     setResults([]);
  //     return;
  //   }
  //   const request = { input: requestData.address };
  //   service.getQueryPredictions(request, (res:any) => {
  //     setResults(res || []);
  //   });
  // };

  async function handleSubmit(){
    const result = await addRequest({...requestData, requestedBy:userInfo.id as string, location})
    console.log(result)
    if(result){
      setCurrentStep(4);
      setRequestData(baseData);
      enqueueSnackbar("Request submitted successfully.", {
        variant: "success",
      });
    }
    else{
      enqueueSnackbar("Error submitting request!", {
        variant: "error",
      });
      console.log("ERROR SUBMITTING")
    }

  }

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setBackward(true);
        if (requestData.address.trim() === "") setForward(true);
        else setForward(false);
        break;
      case 1:
        setBackward(false);
        setAddressWrong(false)
        if (requestData.type === "") setForward(true);
        else setForward(false);
        break;
      case 2:
        setBackward(false);
        if (requestData.deadline === 0) setForward(true);
        else setForward(false);
        break;
      case 3:
        setForward(true);
        setBackward(false)
        break;
      case 4:
        setForward(true);
        setBackward(true)
        break;
      default:
        setForward(false);
        setBackward(false)
    }
  }, [currentStep, requestData]);

  return (
    <div>
      {/*<Navbar/>*/}
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" margin="5%">
          <Paper elevation={3}
                 sx={{p: 4, backgroundColor: "white", position: "relative", minWidth: "100%", minHeight: "100%"}}>

            {currentStep === 0 && <div>
              {!addressWrong ?
                <Typography variant="h4" textAlign="center">
                    Enter the address you would like to request for accessibility labeling
                </Typography>
                :
                <Typography variant="h4" textAlign="center">
                  Sorry, the entered address does not seem to be valid. Please try again.
                </Typography> }
                <Box textAlign="center" marginTop={5}>
                    <TextField sx={{minWidth: "50%"}} label="Address" value={requestData.address}
                               onChange={(e) => setRequestData({...requestData, address: e.target.value})}/>
                </Box>
            </div>
            }
            {currentStep === 1 && <div>
                <Typography variant="h4" textAlign="center">
                    Would you like to request data for just this address or for the area around this address as well?
                </Typography>
                <Box display="flex" textAlign="center" marginTop={4} justifyContent="center" gap="4rem">
                    <Button variant="contained"
                            onClick={() => {setRequestData({...requestData, type: "point"}); setCurrentStep(currentStep+1)}}>single address</Button>
                    <Button variant="contained"
                            onClick={() => {setRequestData({...requestData, type: "area"}); setCurrentStep(currentStep+1)}}> area </Button>
                </Box>
            </div>}
            {currentStep === 2 && <div>
                <Typography variant="h4" textAlign="center">
                    Would you like to set a deadline for this request?
                </Typography>
                <Box display="flex" textAlign="center" marginTop={4} justifyContent="center" gap="5%">
                    <Button variant="contained"
                            onClick={() => {setRequestData({...requestData, deadline: 7}); setCurrentStep(currentStep+1)}}> 7 days</Button>
                    <Button variant="contained"
                            onClick={() => {setRequestData({...requestData, deadline: 3}); setCurrentStep(currentStep+1)}}> 3 days </Button>
                    <Button variant="contained"
                            onClick={() => {setRequestData({...requestData, deadline: -1}); setCurrentStep(currentStep+1)}}> no deadline </Button>
                </Box>
            </div>}
            {currentStep === 3 && <div>
                <Typography variant="h4" textAlign="center"> Click the button to submit your request</Typography>

                <Typography variant="h6" textAlign="center">Does this look ok?</Typography>
                <Grid container sx={{textAlign: "center"}}>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Address:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{requestData.address}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Type:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{requestData.type}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography fontWeight="bold">Deadline:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{requestData.deadline} days</Typography>
                    </Grid>
                </Grid>

                <Button fullWidth type="submit" variant="contained" color="primary"
                        sx={{fontWeight: "bold", mt: 3, bgcolor:"white", border:1, color:"black"}} onClick={()=> {handleSubmit()}}>Submit Request</Button>
            </div>}
            {currentStep === 4 && <div>
                <Typography variant="h4" textAlign="center"> Thank you for submitting your request! Our volunteers will label the requested area as soon as possible.</Typography>
                <Box display="flex" textAlign="center" marginTop={4} justifyContent="center" gap="5%" sx={{display:retry}}>
                    <Typography variant="h6" textAlign="center">Would you like to submit another request?</Typography>
                    <Button variant="contained" sx={{ mr:"5%"}}
                            onClick={() => {setCurrentStep(0)}}>Yes</Button>
                    <Button variant="contained"
                            onClick={()=> setRetry('none')}>No</Button>

                </Box>
              {retry === 'none' &&
                  <Box display="flex" textAlign="center" marginTop={4} justifyContent="center" gap="5%" >
                      <Button variant="contained" onClick={()=>navigate("/")}>Go Home</Button>
                  </Box>}
            </div>
            }
            <Grid container sx={{mt: "10%", display:retry}}>
              <Grid item xs={6} sx={{textAlign: "left", }}>
                <Button aria-label="Backward Button" disabled={backward}
                            onClick={() => setCurrentStep(currentStep - 1)}
                            sx={{position: "absolute", bottom: 16, left: 16, color:"black", border:1}}
                            onKeyDown={(e) => {
                              if (e.key === '37') {
                                setCurrentStep(currentStep - 1)
                              }
                            }}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} sx={{textAlign: "right"}}>
                <Button aria-label="Forward Button" onClick={() => {
                  if(currentStep === 0)  fetchAddress()
                  else setCurrentStep(currentStep + 1);

                }}
                            disabled={forward} sx={{position: "absolute", bottom: 16, right: 16, color:"black", border:1}}
                            onKeyDown={(e) => {
                              if (e.key === '39') {
                                setCurrentStep(currentStep + 1)
                              }
                            }}
                >
                  Forward
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </ Container>
    </div>
  )
}