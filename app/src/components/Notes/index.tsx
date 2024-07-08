import { Container, TextField, Button } from '@mui/material'
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
    // saveImageToDiffList,
  } from "../../apis/user";

export default function Notes({ page, id }: {
    page: string;
    id: string;
}) {
    const defaultNotes: NotesInterface =
    {
        name: "",
        address: "",
        additionalInfo: ""
    }
    const { enqueueSnackbar } = useSnackbar();
    const { userInfo, clearUserInfo } = useUserStore();
    const navigate = useNavigate();
    const [edited, setEdited] = useState(false)
    const { currentSelectedImage, collectedImageList, panoramaMarkerList,} = useExplorationStore();
    const { selectedBoxId,onChangeNotesOpen, notesOpen } = useReactToolInternalStore();
    const { updateCurrentNotes, reactToolImageList, selectedImageId} = useReactToolsStore();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [editButtonText, setEditButtonText] = useState('edit?')
    const currentBoxNotes = useMemo(() => findCurrentBoxNotes(), [selectedBoxId]);
    const [name, setName] = useState(currentBoxNotes.name)
    const [address, setAddress] = useState(currentBoxNotes.address)
    const [additionalInfo, setAdditionalInfo] = useState(currentBoxNotes.additionalInfo)
    // const dropdownOptions = ["", "Yes", "No"]
    //onChangeNotesOpen(true)
    // additional information field
    function setNewNotes(): NotesInterface {
        return (
            {
                name: name,
                address: address,
                additionalInfo: additionalInfo
            }
        )
    }

    function findCurrentBoxNotes(): NotesInterface {
        let box: NotesInterface = defaultNotes;
        if (selectedBoxId !== "") {
            if (page === 'explore') {
              console.log(panoramaMarkerList)
              console.log(selectedBoxId)
                const currentBox = panoramaMarkerList.filter(
                    (item) => item.label_id === selectedBoxId
                )[0];
              console.log(currentBox)
               if (currentBox && currentBox.notes !== undefined) { box = currentBox.notes }
            }
            else if (page === "label") {
              console.log(reactToolImageList)
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
        setAdditionalInfo(currentBoxNotes.additionalInfo)
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

        // if(page==="explore"){
        //     const submitId = currentSelectedImage
        // }
        // else {const submitId = selectedImageId}
        const submitId = page==="explore" ? currentSelectedImage : selectedImageId
        const result = await updateNewHumanLabels(
            {
                imageId: submitId,
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
                label='Additional Information'
                size='small'
                fullWidth
                disabled={buttonDisabled}
                onChange={(event) => { setAdditionalInfo(event.target.value) }}
                value={additionalInfo}
            >
            </TextField>

            <Box sx={{ pt: '5%', pl: '75%' }} >
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