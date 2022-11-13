const styles = {
	WHITE: 1,
	RED: 2
}

let style = styles.WHITE
let listeners = []

export default {
	setStyle: (_style) => {
		style = _style
		listeners.forEach((listener) => {
			listener(style)
		})
	},
	onChange: (listener) => {
		listeners.push(listener)
	},
	removeListener: (listener) => {
		listeners.splice(listeners.indexOf(listener), 1)
	},
	styles
}