import { replacePlaylistData } from './playlistReducer'
import { replacePlayerState } from './playerReducer'

export const actions = {
  CHANGE_APP_MODE_ATTEMPTED: 'CHANGE_APP_MODE_ATTEMPTED',
  CHANGE_APP_MODE_FAILED: 'CHANGE_APP_MODE_FAILED',
  CHANGE_APP_MODE_SUCCEEDED: 'CHANGE_APP_MODE_SUCCEEDED',
  WS_SEND_DATA_ATTEMPTED: 'SEND_DATA_ATTEMPTED',
}

export const APP_MODES = {
  STANDALONE: 'STANDALONE',
  HOST_CLIENT: 'HOST_CLIENT',
  CLIENT: 'CLIENT',
}

export function establishWSConnection(mode, address) {
  return (dispatch, getState) => {
    const { app } = getState()

    if (app.isModeChanging) {
      return;
    }

    dispatch({ type: actions.CHANGE_APP_MODE_ATTEMPTED })

    try {
      const wsConnection = new WebSocket(`ws://${address}/ws`)
      window.a = wsConnection
      wsConnection.onerror = () => {
        dispatch({ type: actions.CHANGE_APP_MODE_FAILED })
      }
      wsConnection.onopen = () => {
        dispatch({ type: actions.CHANGE_APP_MODE_SUCCEEDED, mode, wsConnection })
      }
      wsConnection.onmessage = (msg) => {
        const res = msg.data || {}
        const { playlist, player } = res

        if (playlist) {
          dispatch(replacePlaylistData(JSON.parse(playlist)))
        }
        if (player) {
          dispatch(replacePlayerState(JSON.parse(player)))
        }
      }
    } catch (e) {
      dispatch({ type: actions.CHANGE_APP_MODE_FAILED })
    }
  };
}

export function disconnectWSConnection(cb) {
  return (dispatch, getState) => {
    const { isModeChanging, wsConnection } = getState().app

    if (isModeChanging) {
      return;
    }

    dispatch({ type: actions.CHANGE_APP_MODE_ATTEMPTED })

    try {
      wsConnection.close()
      dispatch({
        type: actions.CHANGE_APP_MODE_SUCCEEDED,
        mode: APP_MODES.STANDALONE,
        wsConnection: null,
      })
      if (cb) {
        cb()
      }
    } catch (e) {
      dispatch({ type: actions.CHANGE_APP_MODE_FAILED })
      if (cb) {
        cb()
      }
    }
  };
}

export const defaultState = {
  mode: APP_MODES.STANDALONE,
  isModeChanging: false,
  wsConnection: null,
  serverState: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.CHANGE_APP_MODE_ATTEMPTED:
      return {
        ...state,
        isModeChanging: true,
      }
    case actions.CHANGE_APP_MODE_FAILED:
      alert('Oops, something went wrong!') // FIXME
      return {
        ...state,
        isModeChanging: false,
      }
    case actions.CHANGE_APP_MODE_SUCCEEDED:
      return {
        ...state,
        isModeChanging: false,
        mode: action.mode || state.mode,
        wsConnection: action.wsConnection,
      }
    default:
      return state
  }
}
