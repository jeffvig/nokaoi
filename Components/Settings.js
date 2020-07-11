import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PlayerSelect from './PlayerSelect'
import Button from '@material-ui/core/Button'
import * as constants from '../constants';

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
  gas: {
    paddingLeft: theme.spacing(20),
    margin: 40,
  },
  saveButton: {
    padding: 10
  },
  clearButton: {
    padding: 10,
    margin: 10
  }
}));

export default function Settings( {_players, allPlayers, onPlayersChange} ) {
  const classes = useStyles();

  const [players, setPlayers] = useState(_players)

  useEffect(() => {
    setPlayers(_players)
  },[_players]);

  useEffect(() => {
    //console.log('Settings - useEffect players: ', players)
  },[players]);

  const fetchPairingPartners = (scorer_name, scorer_pairing) => {
    //Find all players with the same pairing
    const pairingObjs = allPlayers.filter( player => ((player.player_pairing === scorer_pairing) && (player.player_name !== scorer_name)) )
    if (pairingObjs.length > 0) updatePlayer('partner1', pairingObjs[0])
    if (pairingObjs.length > 1) updatePlayer('partner2', pairingObjs[1])
    if (pairingObjs.length > 2) updatePlayer('partner3', pairingObjs[2])
  }

  const fetchCache = (players) => {

    const cacheScorerHandle = localStorage.getItem("scorerHandle")
    console.log('cacheScorerHandle: ', cacheScorerHandle)
    //console.log('scorer: ', scorer)
    if (cacheScorerHandle.length > 0) {
      setScorer((players.find( player => player.player_name === cacheScorerHandle )))
      console.log('useEffect single Settings: setting scorer to ', cacheScorerHandle)
    }
    
    const today = new Date().toJSON().slice(0,10).replace(/-/g,'/')
    const NoKaOiSaveDate = ( localStorage.getItem(constants.NoKaOiSaveDate) === null ? '01/01/1900' : localStorage.getItem(constants.NoKaOiSaveDate))

    if (NoKaOiSaveDate === today) {
      //If the settings were saved today, grab them out of the cache
      const cachePartner1Handle = localStorage.getItem("Partner1Handle")
      const cachePartner2Handle = localStorage.getItem("Partner2Handle")
      const cachePartner3Handle = localStorage.getItem("Partner3Handle")
      if (cachePartner1Handle.length > 0) setPartner1(players.find( player => player.player_name === cachePartner1Handle ))
      if (cachePartner2Handle.length > 0) setPartner2(players.find( player => player.player_name === cachePartner2Handle ))
      if (cachePartner3Handle.length > 0) setPartner3(players.find( player => player.player_name === cachePartner3Handle ))
    } else {
      //If the settings are not from today, pull the other players from the pairings
      console.log('calling fetchPairingPartners from fetchCache')
      fetchPairingPartners(cacheScorerHandle, players)
    }

  }

  const updatePlayer = (playerType, playerObj) => {
    setPlayers(prevState => ({
      ...prevState, 
        [playerType]: {
          ...prevState[playerType], ...playerObj
        }
    }))
  }

  const onscorerchange = (id, playerObj) => {
    if (typeof playerObj !== 'undefined') {
      updatePlayer('scorer', playerObj)
      fetchPairingPartners(playerObj.player_name, playerObj.player_pairing)
    }
  }

  const onparterchange = (id, playerObj) => {
    if (typeof playerObj === 'undefined') playerObj = constants.empty_player
    updatePlayer(id, playerObj)
  }
    
  const handleSaveButtonClick = (e) => {
    console.log('handleSaveButtonClick 1')
    const today = new Date().toJSON().slice(0,10).replace(/-/g,'/')
    localStorage.setItem(constants.NoKaOiSaveDate, today);

    console.log('handleSaveButtonClick 2')
    const partnerList = []
    const partner1 = players.partner1
    const partner2 = players.partner2
    const partner3 = players.partner3
    const partnerList = []
    console.log('handleSaveButtonClick 3')
    if (partner1.player_name.length > 0) partnerList.push(partner1)
    if (partner2.player_name.length > 0) partnerList.push(partner2)
    if (partner3.player_name.length > 0) partnerList.push(partner3)
    console.log('handleSaveButtonClick 4')
    console.log('partnerList: ', partnerList) 
    // updatePlayer('partner1', constants.empty_player)
    // updatePlayer('partner2', constants.empty_player)
    // updatePlayer('partner3', constants.empty_player)
    console.log('handleSaveButtonClick 5')
    let newPlayers = {}
    console.log('...players.scorer: ', ...players.scorer)
    if (partnerList.length === 0) newPlayers = {'scorer' : {...players.scorer}, 'partner1' : {...constants.empty_player}, 'partner2' : {...constants.empty_player}, 'partner3' : {...constants.empty_player}}
    if (partnerList.length === 1) newPlayers = {'scorer' : {...players.scorer}, 'partner1' : {...partnerList[0]}, 'partner2' : {...constants.empty_player}, 'partner3' : {...constants.empty_player}}
    if (partnerList.length === 2) newPlayers = {'scorer' : {...players.scorer}, 'partner1' : {...partnerList[0]}, 'partner2' : {...partnerList[1]}, 'partner3' : {...constants.empty_player}}
    if (partnerList.length === 3) newPlayers = {'scorer' : {...players.scorer}, 'partner1' : {...partnerList[0]}, 'partner2' : {...partnerList[1]}, 'partner3' : {...partnerList[2]}}
    console.log('newPlayers: ', newPlayers)
    setPlayers(newPlayers)

    //Save to cache
    localStorage.setItem(constants.NoKaOiPlayers, JSON.stringify(newPlayers));
    localStorage.setItem(constants.NoKaOiAllPlayers, JSON.stringify(allPlayers));

    //Return the new players up to the parent
    onPlayersChange(newPlayers)


  }

  const handleClearButtonClick = (e) => {
    localStorage.removeItem(constants.NoKaOiSaveDate);
    localStorage.removeItem(constants.NoKaOiPlayers);
    localStorage.removeItem(constants.NoKaOiAllPlayers);
    localStorage.removeItem(constants.NoKaOiPars);
    localStorage.removeItem(constants.NoKaOiHoleHandicaps);
    setPlayers({'scorer' : {...constants.empty_player}, 'partner1' : {...constants.empty_player}, 'partner2' : {...constants.empty_player}, 'partner3' : {...constants.empty_player}})
  }

  const saveDisbled = (players.scorer.player_name.length === 0)

  //console.log('scorer.player_name: ', scorer.player_name)
  return (
    <Fragment>
      <div style={{width: 200, marginTop: 20, marginBottom: 20}}>Player count: { allPlayers.length }</div>
      <PlayerSelect
        id='scorer'
        playerName={players.scorer.player_name}
        playerHasScores={players.scorer.score.reduce(constants.reducer) > 0}
        allPlayers={allPlayers} 
        label='Select your name'
        onchange={(id, e) => { onscorerchange(id, e) }}
      />
      <PlayerSelect
        id='partner1'
        playerName={players.partner1.player_name}
        playerHasScores={players.partner1.score.reduce(constants.reducer) > 0}
        allPlayers={allPlayers} 
        label='Select playing partner 1'
        onchange={(id, e) => { onparterchange(id, e) }}
      />
      <PlayerSelect
        id='partner2'
        playerName={players.partner2.player_name}
        playerHasScores={players.partner2.score.reduce(constants.reducer) > 0}
        allPlayers={allPlayers} 
        label='Select playing partner 2'
        onchange={(id, e) => { onparterchange(id, e) }}
      />
      <PlayerSelect
        id='partner3'
        playerName={players.partner3.player_name}
        playerHasScores={players.partner3.score.reduce(constants.reducer) > 0}
        allPlayers={allPlayers} 
        label='Select playing partner 3'
        onchange={(id, e) => { onparterchange(id, e) }}
      />
      <Button variant='outlined' className={classes.saveButton} onClick={handleSaveButtonClick} disabled={saveDisbled}>Save </Button>
     <Button variant='outlined' className={classes.clearButton} onClick={handleClearButtonClick} >Clear Settings </Button>

      {/*
      <Button variant='outlined' className={classes.numberButtons} onClick={handleClearCacheButtonClick}>Clear Cache</Button>

      <div>{JSON.stringify(players.scorer)}</div>
      <div>{JSON.stringify(players.partner1)}</div>
      <div>{JSON.stringify(players.partner2)}</div>
      <div>{JSON.stringify(players.partner3)}</div>
      */}

    </Fragment>
  );
}