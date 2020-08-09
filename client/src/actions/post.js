import { GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, ADD_POST, DELETE_POST,ADD_COMMENT,REMOVE_COMMENT } from '../actions/types'
import axios from 'axios'
import { setAlert } from './alert'

//getting al posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')
        dispatch(
            {
                type: GET_POSTS,
                payload: res.data
            }
        )
    } catch (error) {

        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}


//add like 
export const addLike = postId => async dispatch => {

    try {
        const res = await axios.put(`/api/posts/like/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        })
    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }
}
//remove like 
export const removeLike = postId => async dispatch => {

    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        })
    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}

//Delete a post

export const deletePost = postId => async dispatch => {

    try {
        await axios.delete(`/api/posts/${postId}`)

        dispatch({
            type: DELETE_POST,
            payload: { id: postId }
        })

        dispatch(setAlert('Post removed', 'success'))

    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}

//Add a post

export const addPost = formData => async dispatch => {

    const config = {
        headers: {
            contentType: 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts`, formData, config)
        dispatch({
            type: ADD_POST,
            payload:res.data 
        })
        dispatch(setAlert('Post created', 'success'))
    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}


//getting a post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch(
            {
                type: GET_POST,
                payload: res.data
            }
        )
    } catch (error) {

        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}

//Add a comment

export const addComment = (postId,formData) => async dispatch => {

    const config = {
        headers: {
            contentType: 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data 
        })
        dispatch(setAlert('Comment added', 'success'))
    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}

//Remove a comment

export const deleteComment = (postId,commentId) => async dispatch => {

    try {
         await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Comment removed', 'success'))
    } catch (error) {
        dispatch(
            {
                type: POST_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            }
        )
    }

}
