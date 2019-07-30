import { StandardProperties } from "csstype";
import { basePropType } from "../basePropType";
import React, { useState } from "react";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { List, LinearProgress, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { merge } from 'lodash';
const DropToUpload = require('react-drop-to-upload').default;
type FilesToUpload = { [key: string]: { buffer: ArrayBuffer, file: File, percent: number } };

export const DropZoneComponent = (obj: { addFiles: (ftu: FilesToUpload, size: number) => void, forceUpdate: Function, allowedExtensions: string[], uploadLimit: number, props: basePropType }) => {
    const style: StandardProperties = {
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px dashed #bbb`,
        boxShadow: 'none'
    }

    const [filesToUpload, setFilesToUpload] = useState({} as FilesToUpload);

    const onDropArrayBuffer = (buffers: ArrayBuffer[], files: File[]) => {
        const ftu: FilesToUpload = {};
        files.map((file, index) => {
            const allowed = obj.allowedExtensions.some((ext) => file.name.endsWith(ext));
            if (!allowed) {
                obj.props.enqueueSnackbar(`You can only upload ${obj.allowedExtensions.join(' ,')} file(s)`, { variant: 'error' });
                obj.props.enqueueSnackbar('Some files were removed', { variant: 'error' });
                return;
            }

            ftu[file.name] = {
                file,
                buffer: buffers[index],
                percent: 0
            }
        });

        let size = 0;
        Object.keys(ftu).map((key) => {
            size = size + ftu[key].file.size;
        });

        if (size > obj.uploadLimit) {
            obj.props.enqueueSnackbar('Total upload size must be less than 20MB', { variant: 'error' });
        }

        const finalObject = merge(filesToUpload, ftu);
        setFilesToUpload(finalObject);
        obj.addFiles(finalObject, size);
    }

    const id = "fksdbkfskd-fsdfs-fsdfsd-fsd-fsdf-fds";

    const highlight = (e: MouseEvent) => {
        document.getElementById(id)!.className = "drop-to-upload-highlight";
    }

    const unhighlight = (e: MouseEvent) => {
        document.getElementById(id)!.className = "drop-to-upload-unhighlight";
    }

    return (
        <React.Fragment>
            <div onDragEnter={highlight as any} onDropCapture={unhighlight as any} onMouseLeave={unhighlight as any} id={id}>
                <DropToUpload style={style} onDropArrayBuffer={onDropArrayBuffer}>
                    Drop files here to upload
                </DropToUpload>
            </div>
            <ListComponent files={filesToUpload} setState={setFilesToUpload} forceUpdate={obj.forceUpdate} />
        </React.Fragment>
    )
}

const ListComponent = (props: { files: FilesToUpload, setState: Function, forceUpdate: Function }) => {

    const files = props.files;
    const deleteKey = (key: string) => {
        delete files[key];
        props.setState(files);
        props.forceUpdate();
    }

    const getSecondary = (bytes: number) => {
        if (bytes < 1000) {
            return `${bytes} bytes`;
        }

        if (bytes < 1000000) {
            return `${Math.floor(bytes / 1000)} kilobytes`;
        }

        if (bytes < 1000000000) {
            return `${Math.floor(bytes / 1000000)} megabytes`;
        }

        return `${bytes} bytes`;
    }

    return (
        <List>
            {Object.keys(files).map((key) => {
                return (
                    <React.Fragment key={key + files[key].file.size}>
                        <LinearProgress variant="determinate" value={files[key].percent} />
                        <ListItem>
                            <ListItemText
                                primary={key}
                                secondary={getSecondary(files[key].file.size)}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => deleteKey(key)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </React.Fragment>
                )
            })}
        </List>
    )
}