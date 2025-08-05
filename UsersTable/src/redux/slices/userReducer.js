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
		lastName: '',
		firstName: '',
		maidenName: '',
		age: '',
		gender: '',
		phone: '',
		email: '',
		country: '',
		city: '',
	},
	pagination: {
		currentPage: 1,
		itemsPerPage: 10,
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
			const { key, value } = action.payload
			state.filters[key] = value
			state.pagination.currentPage = 1
		},
		setPage: (state, action) => {
			state.pagination.currentPage = action.payload
		},
		setItemsPerPage: (state, action) => {
			state.pagination.itemsPerPage = action.payload
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

			Object.entries(state.filters).forEach(([key, value]) => {
				if (!value) return

				switch (key) {
					case 'lastName':
					case 'firstName':
					case 'maidenName':
					case 'email':
					case 'country':
					case 'city':
						filteredUsers = filteredUsers.filter(user =>
							user[key]?.toLowerCase().includes(value.toLowerCase())
						)
						break
					case 'age':
						filteredUsers = filteredUsers.filter(
							user => user.age.toString() === value
						)
						break
					case 'gender':
						filteredUsers = filteredUsers.filter(
							user => user.gender.toLowerCase() === value.toLowerCase()
						)
						break
					case 'phone':
						filteredUsers = filteredUsers.filter(user =>
							user.phone.includes(value)
						)
						break
				}
			})

			if (state.sortConfig.key && state.sortConfig.direction !== 'none') {
				filteredUsers.sort((a, b) => {
					let aValue = a[state.sortConfig.key]
					let bValue = b[state.sortConfig.key]

					if (state.sortConfig.key.includes('.')) {
						const keys = state.sortConfig.key.split('.')
						aValue = keys.reduce((obj, key) => obj?.[key], a)
						bValue = keys.reduce((obj, key) => obj?.[key], b)
					}

					if (aValue === undefined || bValue === undefined) return 0
					if (typeof aValue === 'string' && typeof bValue === 'string') {
						return state.sortConfig.direction === 'ascending'
							? aValue.localeCompare(bValue)
							: bValue.localeCompare(aValue)
					}
					return state.sortConfig.direction === 'ascending'
						? (aValue || 0) - (bValue || 0)
						: (bValue || 0) - (aValue || 0)
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
	setPage,
	setItemsPerPage,
} = userSlice.actions

export default userSlice.reducer
