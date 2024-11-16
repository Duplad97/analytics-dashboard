import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { FormEvent, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { FunnelStage } from '../../interfaces';
import api from '../../config/api.config';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface IProps {
    open: boolean
    handleClose: Function
    funnelStages: FunnelStage[]
    setUsers: Function
}

const defaultUserInput = {
    name: '',
    email: '',
    currentStageId: -1,
};

export default function UserFormDialog(props: IProps) {
    const [userInput, setUserInput] = useState<{ name: string, email: string, currentStageId: number }>(defaultUserInput)

    const handleClose = () => {
        props.handleClose();
        setUserInput(defaultUserInput);
    };

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await api.post("/user/create", userInput);
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Create New User
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <TextField variant="outlined" label="Name" required fullWidth value={userInput.name} onChange={(event) => setUserInput({...userInput, name: event.target.value})} />
                    <TextField sx={{ marginTop: 2 }} variant="outlined" label="Email" required fullWidth value={userInput.email} onChange={(event) => setUserInput({...userInput, email: event.target.value})} />

                    <FormControl fullWidth sx={{ marginTop: 2 }} required>
                        <InputLabel htmlFor="stage-id">Current Stage</InputLabel>
                        <Select
                            id="stage-id"
                            value={userInput.currentStageId >= 0 ? userInput.currentStageId : null}
                            onChange={(event) => setUserInput({ ...userInput, currentStageId: event.target.value as number })}
                            fullWidth
                        >
                            {props.funnelStages.map(stage => {
                                return (
                                    <MenuItem key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </BootstrapDialog>
    );
}