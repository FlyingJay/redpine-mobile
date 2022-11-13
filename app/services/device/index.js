import { Dimensions, Platform } from 'react-native'

export default {
	isIPhoneX: () => {
		const { width, height } = Dimensions.get('window')

		// iphone x / xr
		if (Platform.OS === 'ios' && (width >= 812 || height >= 812)) {
			return true
		}

		return false
	}
}
