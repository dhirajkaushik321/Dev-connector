import axios from 'axios'
import { setAlert } from './alert'
import { GET_PROFILE, GET_PROFILES,GET__REPOS,PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE,ACCOUNT_DELETED } from '../actions/types'

//create user profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    const config = {
        headers: {
            contentType: 'application/json'
        }
    }
    try {
        const res = await axios.post('/api/profile/me', formData, config)
        dispatch(
            {
                type: GET_PROFILE,
                payload: res.data
            }
        )
        dispatch(
            setAlert(edit ? 'Profile updated' : 'Profile created', 'success')
        )
        if (!edit) {
            history.push('/dashboard')
        }

    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        console.log(errors)
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me')
        dispatch(
            {
                type: GET_PROFILE,
                payload: res.data
            }
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({type:CLEAR_PROFILE})
    try {
        const res = await axios.get('/api/profile')
        dispatch(
            {
                type: GET_PROFILES,
                payload: res.data
            }
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Get user profile by id     
export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`)
        dispatch(
            {
                type: GET_PROFILE,
                payload: res.data
            }
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Get Github repos
export const getGithubRepos = username => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/github/${username}`)
        dispatch(
            {
                type:GET__REPOS,
                payload: res.data
            }
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Clear profile on Logout
export const clearProfile = () => dispatch => (
    {
        type: CLEAR_PROFILE
    }
)

//Add experience
export const addExperience = (formData, history) => async dispatch => {
    const config = {
        headers: {
            contentType: 'application/json'
        }
    }
    try {
        const res = await axios.put('/api/profile/experience', formData, config)
        dispatch(
            {
                type: UPDATE_PROFILE,
                payload: res.data
            }
        )
        dispatch(
            setAlert('Experience added', 'success')
        )

        history.push('/dashboard')


    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        console.log(errors)
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

//Add education
export const addEducation = (formData, history) => async dispatch => {
    const config = {
        headers: {
            contentType: 'application/json'
        }
    }
    try {
        const res = await axios.put('/api/profile/education', formData, config)
        dispatch(
            {
                type: UPDATE_PROFILE,
                payload: res.data
            }
        )
        dispatch(
            setAlert('Education added', 'success')
        )

        history.push('/dashboard')


    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        console.log(errors)
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

// Delete experience
export const deleteExperience = id => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/experience/${id}`)
        dispatch(
            {
                type: UPDATE_PROFILE,
                payload: response.data
            }
        )
        dispatch(
            setAlert('Experience removed', 'success')
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

// Delete education
export const deleteEducation = id => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/education/${id}`)
        dispatch(
            {
                type: UPDATE_PROFILE,
                payload: response.data
            }
        )
        dispatch(
            setAlert('Education removed', 'success')
        )
    } catch (error) {
        dispatch(
            {
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}

// Delete experience
export const deleteAccount = id => async dispatch => {
    if(window.confirm("Are you sure you want to delete your account")){

        try {
            await axios.delete('/api/profile')
            dispatch(
                {
                    type: CLEAR_PROFILE,
                }
            )
            dispatch(
                {
                    type:ACCOUNT_DELETED
                }
            )
            dispatch(
                setAlert('Your account has been deleted successfully')
            )
        } catch (error) {
            dispatch(
                {
                    type: PROFILE_ERROR,
                    payload: { msg: error.response.statusText, status: error.response.status }
                }
            )
        }
    }
    
}