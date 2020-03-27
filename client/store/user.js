import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    console.log(res)
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const signup = (
  email,
  firstName,
  lastName,
  password
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/signup`, {
      email,
      firstName,
      lastName,
      password
    })
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const login = (email, password) => async dispatch => {
  let res
  try {
    console.log('test login; ', email, password)
    res = await axios.post(`/auth/login`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

// export const auth = (firstName, lastName, email, password, method) => async dispatch => {
//   let res
//   try {
//     console.log("TESTING SIGN UP: ", firstName, lastName, email, password, method)
//     res = await axios.post(`/auth/${method}`, {firstName, lastName, email, password, method})
//   } catch (authError) {
//     return dispatch(getUser({error: authError}))
//   }

//   try {
//     dispatch(getUser(res.data))
//     history.push('/home')
//   } catch (dispatchOrHistoryErr) {
//     console.error(dispatchOrHistoryErr)
//   }
// }

// export const signup = (email, firstName, lastName, password, method) => async dispatch => {
//   let res
//   try {
//     console.log('TESTING', email, firstName, lastName, password, method)
//     let data = {email, firstName, lastName, password, method}
//     res = await axios.post(`auth/${method}`, data)
//   } catch (error) {
//     console.log(dispatchOrHistoryErr)
//   }
// }

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
