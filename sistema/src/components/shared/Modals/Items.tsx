import React from 'react'
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import { DialogBody } from '@material-tailwind/react';
import { Global } from '../../../helper/Global';
import { coloresValues } from '../Interfaces';

interface SimpleDialogProps {
    open: boolean;
    selectedValues: string[];
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
    titulo: string;
    onClose: (values: string[]) => void; // Cambiar el tipo de parámetro
    onListItemClick: (value: string) => void; // Agregar función de manejo de selección
}

export interface valuesItems {
    titulo: string;
    urls: coloresValues[];
    carpeta: string;
    selectedValues: string[];
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}



const Items = ({ titulo, selectedValues, setSelectedValues, urls, carpeta }: valuesItems) => {

    const [open, setOpen] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleClickOpen = (e: any) => {
        e.preventDefault();
        setOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleListItemClick = (value: string) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(prevSelectedValues => prevSelectedValues.filter(val => val !== value));
        } else if (selectedValues.length < 10) {
            setSelectedValues(prevSelectedValues => [...prevSelectedValues, value]);
        } else {
            setOpenSnackbar(true); // Mostrar el Snackbar cuando se supera el límite de selección
        }
    };



    function SimpleDialog(props: SimpleDialogProps) {
        const { onClose, onListItemClick, open, titulo, selectedValues } = props;

        const handleListItemClick = (value: string) => {
            onListItemClick(value);
        };

        return (
            <>
                <Dialog onClose={() => onClose(selectedValues)} open={open}>
                    <DialogTitle>{titulo}</DialogTitle>
                    <List sx={{ pt: 0 }} className='grid grid-cols-5 px-4'>
                        {urls.map((imageUrl, index) => (
                            <ListItem disableGutters key={index}>
                                <ListItemButton onClick={() => handleListItemClick(imageUrl.imagen1)} key={index}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <img src={`${Global.urlImages}/${carpeta}/${imageUrl.imagen1}`} alt={`Image ${index}`} className='block mx-auto' style={{objectFit: 'contain', width: '50px'}} />
                                        </Avatar>
                                    </ListItemAvatar>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <DialogBody>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-5 px-4">
                            {selectedValues.map((value, index) => (
                                <div key={index}>
                                    <img src={`${Global.urlImages}/${carpeta}/${value}`} width="60px"/>
                                </div>
                            ))}

                        </div>
                    </DialogBody>


                </Dialog>

            </>
        )

        
    }

         


    return (
        <div className='flex gap-5 items-center'>
            <button onClick={handleClickOpen} className='bg-[#00365F] px-6 py-2 rounded-md h-fit font-bold' >
                {titulo}
            </button>
            <Typography variant="subtitle1" component="div" className='grid grid-cols-5 py-3 px-3 items-center gap-x-3 gap-y-3 bg-white rounded-xl'>
                {selectedValues.map((value, index) => (
                    <div key={index}>
                        <img src={`${Global.urlImages}/${carpeta}/${value}`}   alt={`${index}`} width="60px"/>
                    </div>
                ))}
            </Typography>
            {openSnackbar && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message="Solo puedes seleccionar 10"
                />
            )}
            {open && (
                <SimpleDialog
                    selectedValues={selectedValues}
                    setSelectedValues={setSelectedValues}
                    open={open}
                    titulo={titulo}
                    onClose={handleClose}
                    onListItemClick={handleListItemClick}
                />
            )}
        </div>
    )
}

export default Items


