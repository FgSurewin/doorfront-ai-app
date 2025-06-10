import React from 'react'
import _ from "lodash"
import { AllUserScores, getAllUsersFromDB } from "../../apis/user"
import { sendMail } from "../../apis/mailer"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"

export default function Mailer() {
  const [recEmail, setRecEmail] = React.useState<string>("tortiz003@citymail.cuny.edu")
  const [subject, setSubject] = React.useState<string>("Test")
  const [body, setBody] = React.useState<string>(`<b>Hello World ${subject}!</b>`)
  const [institution, setInstitution] = React.useState<string>("")
  const [allUsers, setAllUsers] = React.useState<AllUserScores[]>([]);
  const [selectedUsers,setSelectedUsers] = React.useState<AllUserScores[]>([]);
  const [numUsers, setNumUsers] = React.useState<number>(10)

  React.useEffect(()=>{
    async function loadFunc() {
      const result = await getAllUsersFromDB();
      if (result.code === 0) {
        setAllUsers(_.orderBy(result.data, ["updatedAt"], ["desc"]));
      }
    }
    loadFunc()
  },[])

  function showRecentUsers() {

    let temp = allUsers
    if (institution !== "") {
      temp = allUsers.filter(item => item.institution.toLowerCase().includes((institution.toLowerCase())))

      // console.log(allUsers)
      // for(let i = 0; i < allUsers.length; i++){
      //     console.log(allUsers[i].email)
      //     console.log(allUsers[i].institution.includes(institution))
      //     if(!allUsers[i].institution.includes(institution))setAllUsers(allUsers.splice(i,1))
      // //     // if(!allUsers[i].institution.toLowerCase().includes(institution.toLowerCase())) {
      // //     //     console.log("X "+allUsers[i].institution.toLowerCase() + " does not include " + institution.toLowerCase())
      // //     //     allUsers.splice(i,1)
      // //     // } else console.log("O " + allUsers[i].institution.toLowerCase() + " does include " + institution.toLowerCase())
      //  }
    }

    var emails = ""
    const length = Math.min(temp.length, numUsers)
    let tempUsers= [];
    for (let i = 0; i < length; i++) {
      if (i === length - 1) emails += temp[i].email
      else emails += temp[i].email + ", "
      tempUsers.push(temp[i])
    }
    console.log(temp)
    setSelectedUsers(tempUsers)
    setRecEmail(emails)
    //console.log(allUsers)
  }

  async function sendMailTogether() {
    const res = await sendMail({ recipient: recEmail, html: body, subject: subject })
    console.log(res)
  }

  async function sendMailSeperately() {
    let emails: string[];
    emails = recEmail.split(",")
    for(let i = 0; i < emails.length; i++){
      emails[i] = emails[i].trim()
      // const res = await sendMail({ recipient: emails[i], html: body, subject: subject })
      // console.log(res)
    }
    console.log(selectedUsers)
    console.log(emails)
  }

  return (
    <>
      <Box sx={{ marginTop: 5 }}>
        <TextField label="recipient email" size="small" value={recEmail} fullWidth multiline onChange={(e) => setRecEmail(e.target.value)}></TextField>
        <TextField label="subject" size="small" sx={{ mt: "2%" }} value={subject} onChange={(e) => setSubject(e.target.value)}></TextField>
        <TextField multiline label="Email Body" size="small" value={body} onChange={(e) => setBody(e.target.value)} fullWidth margin="normal"></TextField>


        <button onClick={() => sendMailTogether()}>Send Email Together</button>
        <button onClick={() => sendMailSeperately()}>Send Email Seperately</button>
      </Box>
      <TextField label="Num Emails to Retrieve" size="small" value={numUsers} onChange={(e) => setNumUsers(+e.target.value)} margin="normal"></TextField>

      <TextField label="Institution filter" size="small" value={institution} onChange={(e) => setInstitution(e.target.value)} margin="normal"></TextField>
      <button onClick={() => showRecentUsers()} style={{ "marginTop": 20 }}>Get recently modified users</button>
    </>
  )



}