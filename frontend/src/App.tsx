import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import 'antd/dist/reset.css'
import './assets/tailwind-generated.css'

export default class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		)
	}
}
