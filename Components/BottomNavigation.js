import React, { Fragment, useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Scoring from './Scoring'
import Leaderboard from './Leaderboard'
import Settings from './Settings'
import * as constants from '../constants';

import blue from '@material-ui/core/colors/blue';
import { green, grey } from "@material-ui/core/colors"
import white from '@material-ui/core/colors';

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

export default function BottomNavigation() {

  const classes = useStyles()

  const [value, setValue] = useState(1)
  const [response, setResponse] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parResponse, setParResponse] = React.useState(null)
  const [parError, setParError] = React.useState(null)
  const [parEmpty, setParEmpty] = useState(false)
  const [parLoading, setParLoading] = useState(false)
  const [pars, setPars] = useState([])
  const [hdcpResponse, setHdcpsResponse] = React.useState(null)
  const [hdcpError, setHdcpsError] = React.useState(null)
  const [hdcpEmpty, setHdcpsEmpty] = useState(false)
  const [hdcpLoading, setHdcpsLoading] = useState(false)
  const [hdcps, setHdcps] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [players, setPlayers] = useState({scorer: {...constants.empty_player}, 
                                          partner1: {...constants.empty_player}, 
                                          partner2: {...constants.empty_player}, 
                                          partner3: {...constants.empty_player}})

  const [rowEdit, setRowEdit] = useState({
    rowEdit: { "1x0": [1, 1, 1, 1, 1] }
  });

  function onClick() {
    setRowEdit(prevState => ({
      ...prevState,
      rowEdit: {
        ...prevState.rowEdit,
        "1x0": prevState.rowEdit["1x0"].map((row, index) =>
          index === 1 ? 0 : row
        )
      }
    }))

    const holenum = 18
    const playernum = 'partner3'
    ysetPlayers(prevState => ({
      ...prevState, 
        [playernum]: {
          ...prevState[playernum], 
            score: prevState[playernum]["score"].map((hole, index) => 
              index === holenum ? 8 : hole
            )
        }
    }))
  }

  const loadData = async () => {
    setLoading(true);
    try {
        const res = await fetch("https://jeffvig.heliohost.org/golf/api/player/read.php", {});
        const json = await res.json();
        setLoading(false);
        setResponse(json);
        if (json.hasOwnProperty('message')) {
          setEmpty(true);
        } else {
          setEmpty(false)
          setAllPlayers(json.data)
        }
      } catch (error) {
        console.log('allplayers fetching error: ',error)
        setError(error);
      }
  }
  
  const loadPars = async () => {
    setParLoading(true);
    try {
        const res = await fetch("https://jeffvig.heliohost.org/golf/api/score/read_pars.php", {});
        const json = await res.json();
        setParLoading(false);
        setParResponse(json);
        if (json.hasOwnProperty('message')) {
          setParEmpty(true);
        } else {
          setParEmpty(false)
          const newPars = []
          for (let i = 0; i < 19; i++ ) {
            newPars.push(json.data[i].par)
          }
          console.log('newPars: ', newPars, newPars[1], newPars[10])
          setPars(newPars)
          localStorage.setItem(constants.NoKaOiPars, JSON.stringify(newPars));
        }
      } catch (error) {
        console.log('par fetching error: ', error)
        setParError(error);
      }
  }
  
  const loadHoleHandicaps = async () => {
    setHdcpLoading(true);
    try {
        const res = await fetch("https://jeffvig.heliohost.org/golf/api/score/read_hole_handicaps.php", {});
        const json = await res.json();
        setHdcpLoading(false);
        setHdcpResponse(json);
        if (json.hasOwnProperty('message')) {
          setHdcpEmpty(true);
        } else {
          setHdcpEmpty(false)
          const newHdcps = []
          for (let i = 0; i < 19; i++ ) {
            newHdcps.push(json.data[i].hole_handicap)
          }
          console.log('newHdcps: ', newHdcps, newHdcps[1], newHdcps[10])
          setHdcps(newHdcps)
          localStorage.setItem(constants.NoKaOiHoleHandicaps, JSON.stringify(newHdcps));
        }
      } catch (error) {
        console.log('hdcp fetching error: ', error)
        setHdcpError(error);
      }
  }
  
  useEffect(() => {

    //Check the cache for when the selections were made
    const NoKaOiSaveDate = ( localStorage.getItem(constants.NoKaOiSaveDate) === null ? '01/01/1900' : localStorage.getItem(constants.NoKaOiSaveDate))
    const today = new Date().toJSON().slice(0,10).replace(/-/g,'/')
    console.log('NoKaOiSaveDate: ', NoKaOiSaveDate)
    if ((typeof (NoKaOiSaveDate) !== 'undefined') && (NoKaOiSaveDate.length > 0) && (NoKaOiSaveDate === today)) {
      //We have valid cache Date
      setValue(0)
      setPlayers(JSON.parse(localStorage.getItem(constants.NoKaOiPlayers)))
      setAllPlayers(JSON.parse(localStorage.getItem(constants.NoKaOiAllPlayers)))
      setPars(JSON.parse(localStorage.getItem(constants.NoKaOiPars)))
      setHdcps(JSON.parse(localStorage.getItem(constants.NoKaOiHoleHandicaps)))
      //console.log('allPlayers cache: ', localStorage.getItem(constants.NoKaOiAllPlayers))
    } else {
      loadData()
      loadPars()
      localStorage.removeItem(constants.NoKaOiPars)
      loadHoleHandicaps()
      localStorage.removeItem(constants.NoKaOiHoleHandicaps)
    }
  },[])
  
  useEffect(() => {
  },[pars])
  
  useEffect(() => {
    console.log('new handicaps: ', hdcps)
  },[hdcps])
  
  useEffect(() => {
    console.log('new handicaps loading: ', hdcpLoading)
  },[hdcpLoading])
  
  useEffect(() => {
    //console.log('players: ', players)
  },[players])
  
  useEffect(() => {
    //console.log('allPlayers: ', allPlayers)
  },[allPlayers])
  
  const onplayerschanges = (playerList) => {
    console.log('bottomNav received: ', playerList)
    setPlayers(playerList)
    setValue(0)
  }
    
  return (
    <Fragment>
     <ThemeProvider theme={theme}>
        <main>
          <div />
            {value === 0 && <Scoring 
                              _players={players} 
                              _pars={pars}
                              _holdHandicaps={hdcps}/> 
            } 
            {value === 1 && <Leaderboard /> } 
            {value === 2 && <Settings 
                              _players={players} 
                              allPlayers={allPlayers} 
                              onPlayersChange={(e) => { onplayerschanges(e) }} /> 
            } 
        </main>

        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            //console.log(newValue)
          }}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction label="Scoring"/>
          <BottomNavigationAction label="Leaderboard"/>
          <BottomNavigationAction label="Settings"/>
        </BottomNavigation>
      </ThemeProvider>
    </Fragment>
  )
}