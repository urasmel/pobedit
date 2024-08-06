import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const get_error_element = (callback) => {
    const errorAction = (
        <React.Fragment>
        <IconButton
                size= "small";
    aria - label="close";
    color = "inherit";
    onClick = { callback }
        >
        <CloseIcon fontSize="small" />
            </IconButton>
            </React.Fragment>
    );
};
