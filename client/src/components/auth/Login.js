import React, { Fragment,useState } from "react"
import {Link,Redirect} from  'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {login} from '../../actions/auth'
const Login= ({login,isAuthenticated}) => {
    const [formData,setFormData]=useState({
        email:'',
        password:''
    })
    const {email,password}=formData
    // On change event handler
    const onChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    // On submit handler
    const onSubmit=async e=>{
        e.preventDefault()
            login({email,password})
        }
    if(isAuthenticated){
        return <Redirect to='/dashboard'/>
    }
    return (
        <Fragment>
            <h1 class="large text-primary">Sign In</h1>
            <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
            <form onSubmit={onSubmit} class="form" action="create-profile.html">
                <div class="form-group">
                    <input onChange={onChange} type="email" placeholder="Email Address" name="email" value={email} />
    
                </div>
                <div class="form-group">
                    <input
                        onChange={onChange}
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                    />
                </div>
                <input type="submit" class="btn btn-primary" value="Login" />
            </form>
            <p class="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
    }

    Login.propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated:PropTypes.bool.isRequired
    }
    const mapStateToProps=state=>({
        isAuthenticated:state.auth.isAuthenticated
    })
    const mapDispatchToProp={
        login
    }
export default connect(mapStateToProps,mapDispatchToProp)(Login)
