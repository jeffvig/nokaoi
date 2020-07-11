import React, { Fragment, useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import * as constants from '../constants';

import { green, grey, blue } from "@material-ui/core/colors"

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[50]
        },
        text: {
            secondary: grey[900]
        }
    }
});

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    color: "white",
    selected: "primary",
    background: 'green',
    height: 30
  },
  selected: {
     color: "white"
  }
});

export default function Scorecard() {

  const classes = useStyles()

    
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      This is the scorecard
      </ThemeProvider>
    </Fragment>
  )
}