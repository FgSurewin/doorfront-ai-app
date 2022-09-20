import { Container, TextField, Button, MenuItem } from '@mui/material'
import { Box } from '@mui/system';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useExplorationStore } from "../../global/explorationState";
import { NotesInterface } from '../../types/collectedImage'
import { useReactToolInternalStore } from '../LabelTool/state/internalState';
import { useReactToolsStore } from '../LabelTool/state/reactToolState';
import { useSnackbar } from "notistack";
import { useUserStore } from "../../global/userState";
import { deleteAllLocal } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { updateNewHumanLabels } from '../../apis/collectedImage';
import {
    addUserCredit,
    addUserLabelCredit,
    saveImageToDiffList,
  } from "../../apis/user";

export default function Notes({ page, id }: {
    page: string;
    id: string;
}) {
    const defaultNotes: NotesInterface =
    {
        name: "",
        address: "",
        accessible: "",
        handicap: ""
    }
    const { enqueueSnackbar } = useSnackbar();
    const { userInfo, clearUserInfo } = useUserStore();
    const navigate = useNavigate();
    const [edited, setEdited] = useState(false)
    const { currentSelectedImage, collectedImageList, panoramaMarkerList, updateCollectedImageList, updatePanoramaMarkerList } = useExplorationStore();
    const { selectedBoxId,onChangeNotesOpen, notesOpen } = useReactToolInternalStore();
    const { currentNotes, updateCurrentNotes, reactToolImageList, selectedImageId} = useReactToolsStore();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [editButtonText, setEditButtonText] = useState('edit?')
    const currentBoxNotes = useMemo(() => findCurrentBoxNotes(), [selectedBoxId]);
    const [name, setName] = useState(currentBoxNotes.name)
    const [address, setAddress] = useState(currentBoxNotes.address)
    const [accessible, setAccessible] = useState(currentBoxNotes.accessible)
    const [handicap, setHandicap] = useState(currentBoxNotes.handicap)
    const dropdownOptions = ["", "Yes", "No"]
    //onChangeNotesOpen(true)
    function setNewNotes(): NotesInterface {
        return (
            {
                name: name,
                address: address,
                accessible: accessible,
                handicap: handicap,
            }
        )
    }

    function findCurrentBoxNotes(): NotesInterface {
        let box: NotesInterface = defaultNotes;
        if (selectedBoxId !== "") {
            if (page === 'explore') {
                const currentBox = panoramaMarkerList.filter(
                    (item) => item.label_id === selectedBoxId
                )[0];
                if (currentBox.notes !== undefined) { box = currentBox.notes }
            }
            else if (page === "label") {
                const currentImage = reactToolImageList.filter(
                    (item) => item.imageId === selectedImageId
                )[0];
                const currentBox = currentImage.labels.filter(
                    (item) => item.id === selectedBoxId
                )[0];
                if (currentBox.notes !== undefined) { box = currentBox.notes }
            }
            if(!notesOpen) {onChangeNotesOpen(true);}
        }
        //console.log("finding current box...")
        return (box)
    }

    function handleChange() {
        if (buttonDisabled) {
            setButtonDisabled(false);
            setEditButtonText('Save');
            //console.log(id)
            //if (page === "explore") { console.log("image ID: " + currentSelectedImage); console.log("Box ID:" + selectedBoxId) }
            //if(page==="explore"){console.log(currentSelectedImage);console.log(selectedBoxId)}
        }
        else {
            updateCurrentNotes(selectedBoxId, setNewNotes())
            if (page === "label") {
                //changeReactToolImageLabels(id, {notes:setNewNotes()})
                //console.log(reactToolImageList)
            }
            if (page === "explore") {
                setEdited(true)
            }
            //console.log(currentBoxNotes)
            setButtonDisabled(true);
            setEditButtonText('edit?');
        }
    }


    function handleCancel() {
        if (page === 'explore') { setEdited(false) }
        //updateCurrentNotes(selectedBoxId, currentBoxNotes)
        setName(currentBoxNotes.name)
        setAddress(currentBoxNotes.address)
        setAccessible(currentBoxNotes.accessible)
        setHandicap(currentBoxNotes.handicap)
        setButtonDisabled(true);
        setEditButtonText('edit?');
    }

    useEffect(() => {
        handleCancel()
    }, [selectedBoxId]
    )

    const handleSubmit = async () => {
        //console.log(collectedImageList)
        try {
        const currentImage = collectedImageList.filter(
            (imageID) => imageID.image_id === currentSelectedImage
        )[0];
        console.log(currentImage)
        let humanLabels = currentImage.human_labels[0].labels

        for(let i=0; i < humanLabels.length;i++){
            if(humanLabels[i].label_id === selectedBoxId){
                humanLabels[i].notes = setNewNotes()
            }
        }

        if(page==="explore"){
            const id = currentSelectedImage
        }
        else {const id = selectedImageId}
        const result = await updateNewHumanLabels(
            {
                imageId: id,
                data: {
                  name: userInfo.nickname || "Nobody",
                  labels: humanLabels,
                },
              },
              {
                clearUserInfo,
                navigate,
                deleteAllLocal,
              }
        );
        if (result.code === 0) {
            setEdited(false)
            // * Handle User Credits
            // add create credit
            await addUserCredit({ id: userInfo.id!, type: "modify" });
            // add label credit
            await addUserLabelCredit({
              id: userInfo.id!,
              labelNum: humanLabels.filter(
                (item) => item.labeledBy === userInfo.nickname!
              ).length,
            });
    
            enqueueSnackbar("Save successfully", {
              variant: "success",
            });
            
            let newPanoramaMarkerList = panoramaMarkerList;
            for(let i = 0; i < newPanoramaMarkerList.length;i++){
                if(newPanoramaMarkerList[i].label_id === selectedBoxId){
                    newPanoramaMarkerList[i].notes = setNewNotes();
                    break;
                }
            }
            
          }
          
        }
        catch(e) {
            const error = e as Error;
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
    }
    return (
        <Container  >
            <TextField
                variant="standard"
                label='Store Name'
                size='small' fullWidth
                id='name'
                disabled={buttonDisabled}
                onChange={(event) => { setName(event.target.value) }}
                value={name}
            />
            <TextField
                variant="standard"
                label='Store Address'
                size='small'
                fullWidth id='address'
                disabled={buttonDisabled}
                onChange={(event) => { setAddress(event.target.value) }}
                value={address}
            />
            <TextField
                variant="standard"
                label='Accessible'
                size='small'
                select
                fullWidth
                disabled={buttonDisabled}
                onChange={(event) => { setAccessible(event.target.value) }}
                value={accessible}
            >
                {dropdownOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                variant="standard"
                label='Handicap Restroom'
                size='small'
                fullWidth
                select
                disabled={buttonDisabled}
                onChange={(event) => setHandicap(event.target.value)}
                value={handicap}
            >
                {dropdownOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <Box sx={{ pt: '5%', pl: '80%' }} >
                {!buttonDisabled &&
                    <Button size='small' onClick={handleCancel} sx={{
                        color: "white",
                        bgcolor: "red",
                        "&:hover": { bgcolor: "darkred" },
                    }}>
                        Cancel
                    </Button>
                }
                {buttonDisabled && edited &&
                    <Button size='small' onClick={handleSubmit} sx={{
                        color: "white",
                        bgcolor: "green",
                        "&:hover": { bgcolor: "darkgreen" },
                    }}>
                        Submit
                    </Button>
                }
                <Button
                    size='small'
                    onClick={handleChange}
                >
                    {editButtonText}
                </Button>
            </Box>
        </Container>
    )
}