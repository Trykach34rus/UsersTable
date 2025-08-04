import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsers } from '../../usersApi.js'

export const getUsers = createAsyncThunk(
	'users/fetchUsers',
	async (_, { rejectWithValue }) => {
		try {
			const data = await fetchUsers()
			return data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)
const initialState = {
	data: [],
	filteredData: [],
	status: 'idle',
	error: null,
	sortConfig: {
		key: null,
		direction: 'none',
	},
	filters: {
		name: '',
		age: '',
		gender: '',
		phone: '',
	},
	columnWidths: {
		firstName: 150,
		lastName: 150,
		maidenName: 150,
		age: 100,
		gender: 100,
		phone: 150,
		email: 200,
		country: 150,
		city: 150,
	},
	selectedUser: null,
}
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setSortConfig: (state, action) => {
			state.sortConfig = action.payload
		},
		setFilter: (state, action) => {
			state.filters[action.payload.key] = action.payload.value
		},
		setColumnWidth: (state, action) => {
			const { column, width } = action.payload
			state.columnWidths[column] = Math.max(50, width)
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload
		},
		applyFiltersAndSorting: state => {
			let filteredUsers = [...state.data]
			if (state.filters.name) {
				const searchTerm = state.filters.name.toLowerCase()
				filteredUsers = filteredUsers.filter(user =>
					`${user.firstName} ${user.lastName}`
						.toLowerCase()
						.includes(searchTerm)
				)
			}
			if (state.filters.age) {
				filteredUsers = filteredUsers.filter(
					user => user.age.toString() === state.filters.age
				)
			}
			if (state.filters.gender) {
				filteredUsers = filteredUsers.filter(
					user =>
						user.gender.toLowerCase() === state.filters.gender.toLowerCase()
				)
			}
			if (state.filters.phone) {
				filteredUsers = filteredUsers.filter(user =>
					user.phone.includes(state.filters.phone)
				)
			}

			if (state.sortConfig.key && state.sortConfig.direction !== 'none') {
				filteredUsers.sort((a, b) => {
					const aValue = a[state.sortConfig.key]
					const bValue = b[state.sortConfig.key]
					if (aValue < bValue) {
						return state.sortConfig.direction === 'ascending' ? -1 : 1
					}
					if (aValue > bValue) {
						return state.sortConfig.direction === 'ascending' ? 1 : -1
					}
					return 0
				})
			}
			state.filteredData = filteredUsers
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getUsers.pending, state => {
				state.status = 'loading'
			})
			.addCase(getUsers.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.data = action.payload
				state.filteredData = action.payload
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload
			})
	},
})
export const {
	setSortConfig,
	setFilter,
	setColumnWidth,
	setSelectedUser,
	applyFiltersAndSorting,
} = userSlice.actions
export default userSlice.reducer
