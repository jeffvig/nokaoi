export const empty_player = {"player_id": "" ,
                      "player_name":"",
                      "player_pairing":"",
                      "division":"",
                      "playing_handicap":"",
                      "tee":"",
                      "gender":"",
                      "score": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                      }

export const NoKaOiSaveDate = 'NoKaOiSaveDate'
export const NoKaOiPlayers = 'NoKaOiPlayers'
export const NoKaOiAllPlayers = 'NoKaOiAllPlayers'
export const NoKaOiPars = 'NoKaOiPars'
export const NoKaOiHoleHandicaps = 'NoKaOiHoleHandicaps'

export const reducer = (accumulator, currentValue) => accumulator + currentValue

function netScoreCompare(a, b) {
  return a.net - b.net;
}

export const calculateNet = (data, par, hdcp) => {
  data.forEach((player, index) => {
    //console.log(element)
    if (player.holes_played > 0) {
      let strokesPerHole = 0
      let holeHandicap = player.playing_handicap
      let totalPar = 0
      let totalStrokes = 0
      if (player.playing_handicap > 17) {
        strokesPerHole = Math.floor( player.playing_handicap / 18 )
        holeHandicap = player.playing_handicap % 18
      }
      for (let hole = 1; hole <= player.holes_played; hole++) {
        totalPar += par[hole]
        totalStrokes += strokesPerHole
        if (hdcp[hole] <= holeHandicap) {
          totalStrokes += 1
        }
      }
      player.net = player.gross - totalPar - totalStrokes
      //player.player_name = player.player_name + '-' + player.playing_handicap + '-' + strokesPerHole + '-' + holeHandicap + '-' + totalPar + '-' + totalStrokes
    } else {
      player.net = 999
    }
  })
  data.sort(netScoreCompare)
  return data
}

