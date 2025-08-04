import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userReducer'

const preloadedState = localStorage.getItem('usersTable')
	? JSON.parse(localStorage.getItem('usersTable'))
	: {}

export const store = configureStore({
	reducer: {
		user: userReducer,
	},
	preloadedState,
})

store.subscribe(() => {
	localStorage.setItem('usersTable', JSON.stringify(store.getState()))
})
