import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Route,Redirect} from 'react-router-dom'

const PrivateRoute = ({component:Component,isAuthenticated,loading,...rest})=> (
    <Route {...rest} render={
        props=>(
            !isAuthenticated &&  !loading ? (<Redirect to="/login"/> ): (<Component {...props} />)
        )
    }/>
)

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated,
    loading:state.auth.loading
})
export default connect(mapStateToProps)(PrivateRoute)
