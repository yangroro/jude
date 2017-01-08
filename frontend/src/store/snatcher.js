import { APP_MODES } from '../reducers/appReducer'
import { actions as playlistActions } from '../reducers/playlistReducer'
import { actions as playerActions } from '../reducers/playerReducer'

const snatcher = store => next => action => {
  const { app } = store.getState()

  if (action.type !== playlistActions.PLAYLIST_STATE_REPLACED &&
    action.type !== playerActions.PLAYER_STATE_REPLACED) {
    console.log(action.type)
  }
  const result = next(action)
  if (app.mode === APP_MODES.STANDALONE ||
    !action.type ||
    action.type === playlistActions.PLAYLIST_STATE_REPLACED ||
    action.type === playerActions.PLAYER_STATE_REPLACED ||
    action.type === playerActions.PLAYER_REGISTERED
  ) {
    return result
  }

  const { wsConnection } = app
  const state = store.getState()

  const dataToSend = {
    playlist: state.playlist,
    player: {
      ...state.player,
      youtubePlayer: null,
    },
  }

  wsConnection.send(JSON.stringify(dataToSend))

  return { type: 'WS_SEND_DATA_ATTEMPTED' }
}

export default snatcher

