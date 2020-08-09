import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import ProfileItem from './ProfileItem'
import { useEffect } from 'react'
import { getProfiles } from '../../actions/profile'
import Spinner from '../layout/Spinner'


const Profile = ({profile:{ profiles, loading},getProfiles}) => {

    // eslint-disable-next-line
    useEffect(()=>{
        getProfiles()
    },[getProfiles])

    return (
        <Fragment>
        { loading ? <Spinner/>
        : <Fragment>
            <h1 className="large text-primary">Developers</h1>
            <p className="lead">
                <i className="fab fa-connectdevelop"></i>
                Browse and connect with developers
            </p>

            <div className="profiles">
                {
                    profiles.length>0
                    ? (
                        profiles.map(profile =>
                        <ProfileItem key={profile._id} profile={profile}/>
                        )
                    )
                    : <h4>No profiles found...</h4>
                }
            </div>
        </Fragment>}
        </Fragment>
    )
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfiles:PropTypes.func.isRequired
}

const mapStateToProps =state=>({
    profile: state.profile
})

export default connect(mapStateToProps,{getProfiles})(Profile)
