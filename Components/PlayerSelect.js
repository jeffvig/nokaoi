import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function PlayerSelect(props) {

  const [player, setPlayer] = useState(props.playerName);
  const [allPlayers, setAllPlayers] = useState(props.allPlayers);

  const selectLabel = props.label

  const handleChange = event => {
      if (props.playerHasScores) alert('Are you sure?')
      props.onchange(props.id, allPlayers.find(function(row) { return props.id, row.player_name === event.target.value; }))
      setPlayer(event.target.value)
      // console.log('handleChange: ', event.target.value)
      // console.log('props.id: ', props.id)
  }

  useEffect(() => {
      //console.log('setPlayer: ', props.playerName)
      // console.log('setPlayer: ', props.playerName.player_name)
      setPlayer(props.playerName)
    // if (typeof props.playerName.player_name !== 'undefined') {
    //   console.log('setPlayer to the props')
    // } else {
    //   setPlayer('')
    //   //console.log('setPlayer: blank')
    // }
    setAllPlayers(props.allPlayers)
  },[props]);
  
  return (
    <Fragment>
       <InputLabel id="lblPlayer">{selectLabel}</InputLabel>
        <Select
          labelId="lblPlayer"
          id="playerSelect"
          value={player}
          onChange={handleChange}
          style={{width: 300, marginTop: 20, marginBottom: 20}}
        >
          <MenuItem value=''><em>None</em></MenuItem>
          {allPlayers.map(row => {
            return (
              <MenuItem key={row.player_id} value={row.player_name}>{row.player_name}</MenuItem>
            );
          })}
        </Select>
   </Fragment>
  );
}