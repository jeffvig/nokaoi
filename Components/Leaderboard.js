import React, { useState, Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  paperroot: {
    width: '100%',
  },
  container: {
    maxHeight: 300,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Leaderboard() {
  const classes = useStyles();
  const [flight, setFlight] = React.useState('Flight A');
  const [display, setDisplay] = React.useState('Scores');

  const handleFlight = (event, newFlight) => {
    if (newFlight !== null) setFlight(newFlight)
    console.log('newFlight: ', newFlight)
  };

  const handleDisplay = (event, newDisplay) => {
    if (newDisplay !== null) setDisplay(newDisplay);
  };

  return (
   <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <ToggleButtonGroup
          value={flight}
          exclusive
          size="small" 
          onChange={handleFlight}
        >
          <ToggleButton value="Flight A">
            Flight A
          </ToggleButton>
          <ToggleButton value="Flight B">
            Flight B
          </ToggleButton>
          <ToggleButton value="Flight C">
            Flight C
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <ToggleButtonGroup
          value={display}
          exclusive
          size="small" 
          onChange={handleDisplay}
        >
          <ToggleButton value="Scores">
            Scores
          </ToggleButton>
          <ToggleButton value="Distances">
            Distances
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <hr style={{color: 'green', backgroundColor: 'green', height: 5, width:400 }} />
      </Grid>
      <Grid item>
        Scores for Flight A
      </Grid>
      <Grid item hidden={flight !== 'Flight A' || display !== 'Scores'}>
        Scores for Flight A
      </Grid>
      <Grid item hidden={flight !== 'Flight A' || display !== 'Distances'}>
        Distances for Flight A
      </Grid>
      <Grid item hidden={flight !== 'Flight B' || display !== 'Scores'}>
        Scores for Flight B
      </Grid>
      <Grid item hidden={flight !== 'Flight B' || display !== 'Distances'}>
        Distances for Flight B
      </Grid>
      <Grid item hidden={flight !== 'Flight C' || display !== 'Scores'}>
        Scores for Flight C
      </Grid>
      <Grid item hidden={flight !== 'Flight C' || display !== 'Distances'}>
        Distances for Flight C
      </Grid>
    </Grid>
  );

//http://jeffvig.heliohost.org/golf/api/utils/get_leaderboard.php

}