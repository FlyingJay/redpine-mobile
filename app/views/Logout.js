import React from 'react'
import { connect } from 'react-redux'

import authActions from 'redpine/app/services/auth/actions'

/**
This view is just here because it doesn't user any data from the userSelector

We were experiencing crashes on logout because the user would be removed 
from the state, but some views were still using data from the user.

The logout procedure is as follows:

1. Use the navigation to replace the stacknavigator (all items on the stack)
	with this Logout view
2. That's it, everything else is done when this component mounts.
*/

class Logout extends React.Component {
	componentDidMount() {
		this.props.logout()
		this.props.navigation.navigate('Login')
	}

	render() {
		return null
	}
}


const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
	logout: () => {
		dispatch(authActions.logout())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)