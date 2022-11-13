import { fromJS } from 'immutable'
import constants from './constants'

export const initialState = fromJS({
	campaigns: [],
	openings: [],
	isLoading: true,
	datesSearched: [],
})

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.IS_LOADING:
			return state
				.set('isLoading', action.isLoading)

		case constants.CAMPAIGNS_LOADED:
			let campaigns = state.get('campaigns').toArray()
			let nextCampaignIds = campaigns.map((campaign) => campaign.id)
			let nextCampaigns = []
			action.campaigns.forEach((campaign) => {
				if (nextCampaignIds.indexOf(campaign.id) === -1) {
					nextCampaignIds.push(campaign.id)
					nextCampaigns.push(campaign)
				}
			})
			return state
				.update('campaigns', currCampaigns => currCampaigns.concat(nextCampaigns))

		case constants.OPENINGS_LOADED:
			let openings = state.get('openings').toArray()
			let nextOpeningIds = openings.map((opening) => opening.id)
			let nextOpenings = []
			action.openings.forEach((opening) => {
				if (nextOpeningIds.indexOf(opening.id) === -1) {
					nextOpeningIds.push(opening.id)
					nextOpenings.push(opening)
				}
			})
			return state
				.update('openings', currOpenings => currOpenings.concat(nextOpenings))

		case constants.DATES_SEARCHED:
			return state
				.update('datesSearched', curr => curr.push(action.datesSearched))

		case constants.RESET:
			return initialState

		default:
			return state
	}
}

export default reducer