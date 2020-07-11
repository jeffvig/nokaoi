import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from "@material-ui/core/TextField";
import AppBar from '@material-ui/core/AppBar'
import Toolbar  from '@material-ui/core/Toolbar'
import Typography  from '@material-ui/core/Typography'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import * as constants from '../constants';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: blue,
    },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  numberButtons: {
    width: '33%',
    height: 55,
    fontSize: '25px',
  }
}));

export default function Scoring( {_players, _pars, _holeHandicaps} ) {
  const classes = useStyles()

  const [postButtonText, setPostButtonText] = React.useState('POST')
  const [response, setResponse] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = useState(false)

  const [players, setPlayers] = useState(_players)
  const [hole, setHole] = useState(1)
  const [focus, setFocus] = useState([true, false, false, false])
  const [currentPlayer, setCurrentPlayer] = useState('')
  const [lastPlayer, setLastPlayer] = useState('scorer')
  const [par, setPars] = useState(_pars)
  const [hdcp, setHdcps] = useState(_holeHandicaps)

  const holeHasZeroScore = (hole, lastPlayer, players) => {
    let retval = false
    if (players.scorer.score[hole] === 0) retval = true
    if (lastPlayer === 'scorer') return retval
    if (players.partner1.score[hole] === 0) retval = true
    if (lastPlayer === 'partner1') return retval
    if (players.partner2.score[hole] === 0) retval = true
    if (lastPlayer === 'partner2') return retval
    if (players.partner3.score[hole] === 0) retval = true
    if (lastPlayer === 'partner3') return retval
  }

  const postData = async () => {
    const score_update = {"event_id": 1, "players": {'scorer' : {...players.scorer}, 'partner1' : {...players.partner1}, 'partner2' : {...players.partner2}, 'partner3' : {...players.partner3}}}
    console.log('score_update: ', JSON.stringify(score_update))
    setLoading(true);
    try {
        const res = await fetch("https://jeffvig.heliohost.org/golf/api/score/update_all.php", {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(score_update)
        });
        setLoading(false);
        const json = await res.json();
        setResponse(json);
        if (json.hasOwnProperty('message')) {
          const newMessage = json.message;
          console.log('newMessage: ', newMessage)
          const newData = json.data;
          console.log('newData: ', newData)
          if (newMessage == 'All Scores Updated') {
            //loadData();
          }
        };
      } catch (error) {
        console.log('newError: ', error);
        setError(error);
      }

    // setLoading(true);
    // try {
    //     const res = await fetch("https://jeffvig.heliohost.org/golf/api/score/update_all.php", {});
    //     const json = await res.json();
    //     setLoading(false);
    //     setResponse(json);
    //     if (json.hasOwnProperty('message')) {
    //       setEmpty(true);
    //     } else {
    //       setEmpty(false)
    //       setAllPlayers(json.data)
    //     }
    //   } catch (error) {
    //     console.log('allplayers fetching error: ',error)
    //     setError(error);
    //   }
  }
  
  useEffect(() => {
    setPlayers(_players)
    // console.log('_players: ', _players)
    // console.log('players: ', players)
    let newLastPlayer = 'partner3'
    if (_players.partner3.player_name.length === 0) newLastPlayer = 'partner2'
    if (_players.partner2.player_name.length === 0) newLastPlayer = 'partner1'
    if (_players.partner1.player_name.length === 0) newLastPlayer = 'scorer'
    setLastPlayer(newLastPlayer)
    console.log('lastPlayer: ', newLastPlayer)


    //set current holenum
    //if hole 1 scores are 0 and others are not 0, it is probably a shotgun start
    const firstHoleWithZeroScore = 0
    for (let i = 1; i < 20; i++) {
      if (holeHasZeroScore(i, newLastPlayer, _players)) {
        firstHoleWithZeroScore = i
        i = 20
      }
      if (i === 19) {
        i = 1
      }
    }
    setHole(firstHoleWithZeroScore)

  },[_players]);

  useEffect(() => {
    console.log('useEffect loading: ', loading)
    if (loading) {
      setPostButtonText('...')
    } else {
      setPostButtonText('Post')
    }
  },[loading]);

  useEffect(() => {
    setPars(_pars)
  },[_pars]);

  useEffect(() => {
    setHdcps(_holeHandicaps)
  },[_holeHandicaps]);

  useEffect(() => {
    localStorage.setItem(constants.NoKaOiPlayers, JSON.stringify(players));
  },[players]);

  const setScore = (newScore) => {
    setPlayers(prevState => ({
      ...prevState, 
        [currentPlayer]: {
          ...prevState[currentPlayer], 
            score: prevState[currentPlayer]["score"].map((holenum, index) => 
              index === hole ? Number(newScore) : holenum
            )
        }
    }))
  }

  const moveFocus = () => {
    if (currentPlayer === lastPlayer) setCurrentPlayer('')
    else if (currentPlayer === 'scorer') setCurrentPlayer('partner1')
    else if (currentPlayer === 'partner1') setCurrentPlayer('partner2')
    else setCurrentPlayer('partner3')
  }
  
  const handleNumberButtonClick = (e) => {
    //const currentPlayer = xplayers.map(function(e) { return e.focus; }).indexOf(true)
    switch(e.currentTarget.innerText.toUpperCase()) {
      case "UNDO":
        break;
      case "POST":
        postData()
        setHole(hole === 18 ? 1 : hole + 1)
        break;
      default:
        if (currentPlayer.length > 0 ) {
          const oldScore = players[currentPlayer].score[hole]
          const newScore = ''
          if (oldScore === 1) {
            newScore = '1' + e.currentTarget.innerText
            setScore(newScore)
          } else {
            newScore = e.currentTarget.innerText
            setScore(newScore)
          }
          if ((newScore !== '0') && (newScore !== '1')) {
            moveFocus()
          }
          break;
        }
    }
  }


  const isInFocus = (id) => (xplayers[id].focus === true ? 'contained' : 'outlined')

  const partner1disabled = (lastPlayer === 'scorer')
  const partner2disabled = (lastPlayer === 'scorer' || lastPlayer === 'partner1')
  const partner3disabled = (lastPlayer === 'scorer' || lastPlayer === 'partner1' || lastPlayer === 'partner2')

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar 
            position="static"
            color="primary" 
          >
            <Toolbar>
               <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
              >
                <Grid item xs={1}>
                  <Button
                    variant='outlined'
                      style={{maxWidth: '45px', maxHeight: '45px', minWidth: '45px', minHeight: '45px', fontSize: '40px'}}
                      onClick={() => setHole(hole === 1 ? 18 : hole - 1)}
                  >
                    &lt;
                  </Button>
                </Grid>
                <Grid item xs={10}>
              <Grid>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center" 
              >
                <Typography variant="h5">
                  Hole #{hole}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Par {par[hole]}
                </Typography>
              </Box>
              </Grid>
                </Grid>
                <Grid item xs={1}>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <Button
                      variant='outlined'
                        style={{maxWidth: '45px', maxHeight: '45px', minWidth: '45px', minHeight: '45px', fontSize: '40px'}}
                        onClick={() => setHole(hole === 18 ? 1 : hole + 1)}
                    >
                      &gt;
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </div>

        <Table>
          <TableBody>
            <TableRow key='scorer'>
              <TableCell style={{padding: 5, width: '10%'}}>
                <Button 
                  style={{ fontSize: '63px' }} 
                  variant={currentPlayer === 'scorer' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCurrentPlayer('scorer')}
                  style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px', fontSize: '30px'}}
                >
                  {players.scorer.score[hole] === 0 ? '' : players.scorer.score[hole]}
                </Button>
              </TableCell>
              <TableCell style={{padding: 5, fontSize: '20pt'}}>
                {players.scorer.player_name}
              </TableCell>
            </TableRow>
            <TableRow key='partner1'>
              <TableCell style={{padding: 5, width: '10%'}}>
                <Button 
                  style={{ fontSize: '63px' }} 
                  variant={currentPlayer === 'partner1' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCurrentPlayer('partner1')}
                  style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px', fontSize: '30px'}}
                  disabled={partner1disabled}
                >
                  {players.partner1.score[hole] === 0 ? '' : players.partner1.score[hole]}
                </Button>
              </TableCell>
              <TableCell style={{padding: 5, fontSize: '20pt'}}>
                {players.partner1.player_name}
              </TableCell>
            </TableRow>
            <TableRow key='partner2'>
              <TableCell style={{padding: 5, width: '10%'}}>
                <Button 
                  style={{ fontSize: '63px' }} 
                  variant={currentPlayer === 'partner2' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCurrentPlayer('partner2')}
                  style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px', fontSize: '30px'}}
                  disabled={partner2disabled}
                >
                  {players.partner2.score[hole] === 0 ? '' : players.partner2.score[hole]}
                </Button>
              </TableCell>
              <TableCell style={{padding: 5, fontSize: '20pt'}}>
                {players.partner2.player_name}
              </TableCell>
            </TableRow>
            <TableRow key='partner3'>
              <TableCell style={{padding: 5, width: '10%'}}>
                <Button 
                  style={{ fontSize: '63px' }} 
                  variant={currentPlayer === 'partner3' ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCurrentPlayer('partner3')}
                  style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px', fontSize: '30px'}}
                  disabled={partner3disabled}
                >
                  {players.partner3.score[hole] === 0 ? '' : players.partner3.score[hole]}
                </Button>
              </TableCell>
              <TableCell style={{padding: 5, fontSize: '20pt'}}>
                {players.partner3.player_name}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table>
          <TableBody>
            <TableRow style={{height: 44}}>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>1</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>2</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>3</Button>
            </TableRow>
            <TableRow>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>4</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>5</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>6</Button>
            </TableRow>
            <TableRow>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>7</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>8</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>9</Button>
            </TableRow>
            <TableRow>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>Undo</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>0</Button>
              <Button variant='outlined' className={classes.numberButtons} onClick={handleNumberButtonClick}>{postButtonText}</Button>
            </TableRow>
          </TableBody>
        </Table>

      {/*
       <div>{JSON.stringify(players.scorer)}</div>
      <div>{JSON.stringify(players.partner1)}</div>
      <div>{JSON.stringify(players.partner2)}</div>
      <div>{JSON.stringify(players.partner3)}</div>
      */}

     </ThemeProvider>
    </Fragment>
  )
}