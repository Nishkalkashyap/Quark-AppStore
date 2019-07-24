import './common.css';
import * as React from 'react';
import { Link } from '@material-ui/core';
export const UploadButton = () => {
    return (
        <div className="upload-btn-wrapper" style={{ display: 'block' }}>
            <Link variant="body2">Upload photo</Link>
            <input type="file" name="myfile" />
        </div>
    )
}