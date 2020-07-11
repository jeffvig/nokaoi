import React, { useState, useEffect, Fragment } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, grey, blue } from "@material-ui/core/colors"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as constants from '../constants';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: green[500]
        },
        secondary: {
            main: green[500]
        },
        text: {
            primary: green[900],
            secondary: green[900]
        },
        action: {
            selected: green[500]
        }
    },
});

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
  container: {
    maxHeight: 330,
  },
  fab:  {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: 0,
    width: '340px',
    height: '335px',
    overflowY: 'auto',
  }
}));

export default function Leaderboard( {_leaderboard, _flight, _pars, _holeHandicaps, onLeaderboardChange } ) {
  const classes = useStyles();
  const [flight, setFlight] = React.useState(_flight);
  const [display, setDisplay] = React.useState('Scores');

  const [response, setResponse] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leaderboard, setLeaderboard] = useState(_leaderboard)
  const [flightLeaderboard, setFlightLeaderboard] = useState([])
  const [par, setPars] = useState(_pars)
  const [hdcp, setHdcps] = useState(_holeHandicaps)

  useEffect(() => {
    setLeaderboard(_leaderboard)
  },[_leaderboard])
  
  useEffect(() => {
    setFlight(_flight)
  },[_flight])
  
  useEffect(() => {
    onLeaderboardChange(leaderboard)
    setFlightLeaderboard(leaderboard.filter( player => (player.division === flight) ))
  },[leaderboard])
  
  useEffect(() => {
    setPars(_pars)
  },[_pars]);

  useEffect(() => {
    setHdcps(_holeHandicaps)
    //console.log('LB UE _holeHandicaps: ', _holeHandicaps)
  },[_holeHandicaps]);

  useEffect(() => {
    setFlightLeaderboard(leaderboard.filter( player => (player.division === flight) ))
  },[flight]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
        const res = await fetch("https://jeffvig.heliohost.org/golf/api/utils/get_leaderboard.php", {});
        const json = await res.json();
        setLoading(false);
        setResponse(json);
        if (json.hasOwnProperty('message')) {
          setEmpty(true);
        } else {
          setEmpty(false)
          const withNet = constants.calculateNet(json.data, par, hdcp)
          setLeaderboard(withNet)
        }
      } catch (error) {
        console.log('loadLeaderboard fetching error: ',error)
        setError(error);
      }
  }
  
  const handleFlight = (event, newFlight) => {
    if (newFlight !== null) setFlight(newFlight)
  };

  const handleDisplay = (event, newDisplay) => {
    if (newDisplay !== null) setDisplay(newDisplay);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <ToggleButtonGroup
            value={flight}
            exclusive
            size="small" 
            onChange={handleFlight}
          >
            <ToggleButton value="Flight A" >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flight A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </ToggleButton>
            <ToggleButton value="Flight B">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flight B&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </ToggleButton>
            <ToggleButton value="Flight C">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flight C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            <Fab color="primary" size='small' onClick={loadLeaderboard} style={{marginLeft: 40 }}>
              <RefreshIcon />
            </Fab>
        </Grid>
        <Grid item>
          <hr style={{color: 'green', backgroundColor: 'green', height: 5, width:340, margin: 0 }} />
        </Grid>
        <Grid item hidden={!loading}>
          <CircularProgress size='100px' style={{color: 'green' }} />
        </Grid>
        <Grid item hidden={loading}>
          <Paper className={classes.paper}>
         <TableContainer className={classes.container}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                  <TableCell
                    align='right'
                    style={{ width: '70%' }}
                  >
                    Player
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ width: '15%' }}
                  >
                    Net
                  </TableCell>
                  <TableCell
                    align='center'
                    style={{ width: '15%' }}
                  >
                    Holes
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightLeaderboard.map(player => {
                return (
                  <TableRow hover tabIndex={-1} key={player.player_id}>
                    <TableCell key='name' align='right' style={{ width: '70%', backgroundColor: 'white' }}>
                      {player.player_name}
                    </TableCell>
                    <TableCell key='net' align='center' style={{ width: '15%', backgroundColor: 'white' }}>
                      {player.net < 999 ? player.net : 'NS'}
                    </TableCell>
                    <TableCell key='holes' align='center' style={{ width: '15%', backgroundColor: 'white' }}>
                      {player.holes_played > 0 ? player.holes_played : ''}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );

}