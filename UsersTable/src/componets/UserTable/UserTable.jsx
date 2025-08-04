import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	applyFiltersAndSorting,
	getUsers,
	setColumnWidth,
	setFilter,
	setItemsPerPage,
	setPage,
	setSelectedUser,
	setSortConfig,
} from '../../redux/slices/userReducer.js'
import './UserTable.css'

export default function UserTable() {
	const dispatch = useDispatch()
	const {
		filteredData = [],
		status,
		error,
		sortConfig,
		filters,
		pagination,
		columnWidths,
		data,
	} = useSelector(state => state.user)

	const resizingRef = useRef({
		isResizing: false,
		columnName: null,
		startX: 0,
		startWidth: 0,
	})

	useEffect(() => {
		dispatch(getUsers())
	}, [dispatch])

	useEffect(() => {
		if (data && data.length > 0) {
			dispatch(applyFiltersAndSorting())
		}
	}, [filters, sortConfig, dispatch, data])

	function handleSort(key) {
		let direction = 'ascending'
		if (sortConfig.key === key) {
			if (sortConfig.direction === 'ascending') {
				direction = 'descending'
			} else if (sortConfig.direction === 'descending') {
				direction = 'none'
			}
		}
		dispatch(setSortConfig({ key, direction }))
	}

	function handleFilterChange(key, value) {
		dispatch(setFilter({ key, value }))
	}

	function handlePageChange(page) {
		dispatch(setPage(page))
	}

	function handleItemsPerPageChange(e) {
		dispatch(setItemsPerPage(Number(e.target.value)))
	}

	function handleRowClick(user) {
		dispatch(setSelectedUser(user))
	}

	function startResize(columnName, e) {
		resizingRef.current = {
			isResizing: true,
			columnName,
			startX: e.clientX,
			startWidth: columnWidths[columnName],
		}

		document.addEventListener('mousemove', handleResize)
		document.addEventListener('mouseup', stopResize)
		e.preventDefault()
	}

	function handleResize(e) {
		if (!resizingRef.current.isResizing) return

		const deltaX = e.clientX - resizingRef.current.startX
		const newWidth = Math.max(50, resizingRef.current.startWidth + deltaX)

		dispatch(
			setColumnWidth({
				column: resizingRef.current.columnName,
				width: newWidth,
			})
		)
	}

	function stopResize() {
		resizingRef.current.isResizing = false
		document.removeEventListener('mousemove', handleResize)
		document.removeEventListener('mouseup', stopResize)
	}

	function getSortIndicator(key) {
		if (sortConfig.key !== key) return null
		switch (sortConfig.direction) {
			case 'ascending':
				return '↑'
			case 'descending':
				return '↓'
			default:
				return null
		}
	}

	const totalItems = filteredData?.length || 0
	const totalPages = Math.ceil(totalItems / pagination.itemsPerPage) || 1
	const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
	const paginatedData =
		filteredData?.slice(startIndex, startIndex + pagination.itemsPerPage) || []

	if (status === 'loading') return <div className='loading'>Loading...</div>
	if (status === 'failed') return <div className='error'>Error: {error}</div>

	return (
		<div className='container'>
			<div className='tableWrapper'>
				<table className='userTable'>
					<thead>
						<tr>
							<th style={{ width: columnWidths.lastName }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('lastName')}
									>
										Фамилия{' '}
										<span className='sort-indicator'>
											{getSortIndicator('lastName')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.lastName || ''}
										onChange={e =>
											handleFilterChange('lastName', e.target.value)
										}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('lastName', e)}
								/>
							</th>

							<th style={{ width: columnWidths.firstName }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('firstName')}
									>
										Имя{' '}
										<span className='sort-indicator'>
											{getSortIndicator('firstName')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.firstName || ''}
										onChange={e =>
											handleFilterChange('firstName', e.target.value)
										}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('firstName', e)}
								/>
							</th>

							<th style={{ width: columnWidths.maidenName }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('maidenName')}
									>
										Отчество{' '}
										<span className='sort-indicator'>
											{getSortIndicator('maidenName')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.maidenName || ''}
										onChange={e =>
											handleFilterChange('maidenName', e.target.value)
										}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('maidenName', e)}
								/>
							</th>

							<th style={{ width: columnWidths.age }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('age')}
									>
										Возраст{' '}
										<span className='sort-indicator'>
											{getSortIndicator('age')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.age || ''}
										onChange={e => handleFilterChange('age', e.target.value)}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('age', e)}
								/>
							</th>

							<th style={{ width: columnWidths.gender }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('gender')}
									>
										Пол{' '}
										<span className='sort-indicator'>
											{getSortIndicator('gender')}
										</span>
									</div>
									<select
										className='table-filter select-filter'
										value={filters.gender || ''}
										onChange={e => handleFilterChange('gender', e.target.value)}
									>
										<option value=''>Все</option>
										<option value='male'>Мужской</option>
										<option value='female'>Женский</option>
									</select>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('gender', e)}
								/>
							</th>

							<th style={{ width: columnWidths.phone }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('phone')}
									>
										Телефон{' '}
										<span className='sort-indicator'>
											{getSortIndicator('phone')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.phone || ''}
										onChange={e => handleFilterChange('phone', e.target.value)}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('phone', e)}
								/>
							</th>

							<th style={{ width: columnWidths.email }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('email')}
									>
										Email{' '}
										<span className='sort-indicator'>
											{getSortIndicator('email')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.email || ''}
										onChange={e => handleFilterChange('email', e.target.value)}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('email', e)}
								/>
							</th>

							<th style={{ width: columnWidths.country }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('country')}
									>
										Страна{' '}
										<span className='sort-indicator'>
											{getSortIndicator('country')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.country || ''}
										onChange={e =>
											handleFilterChange('country', e.target.value)
										}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('country', e)}
								/>
							</th>

							<th style={{ width: columnWidths.city }}>
								<div className='th-content'>
									<div
										className='sortable-header'
										onClick={() => handleSort('city')}
									>
										Город{' '}
										<span className='sort-indicator'>
											{getSortIndicator('city')}
										</span>
									</div>
									<input
										type='text'
										className='table-filter'
										placeholder='Фильтр...'
										value={filters.city || ''}
										onChange={e => handleFilterChange('city', e.target.value)}
									/>
								</div>
								<div
									className='resize-handle'
									onMouseDown={e => startResize('city', e)}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map(user => (
							<tr key={user.id} onClick={() => handleRowClick(user)}>
								<td>{user.lastName}</td>
								<td>{user.firstName}</td>
								<td>{user.maidenName}</td>
								<td>{user.age}</td>
								<td>{user.gender === 'male' ? 'Мужской' : 'Женский'}</td>
								<td>{user.phone}</td>
								<td>{user.email}</td>
								<td>{user.address?.country}</td>
								<td>{user.address?.city}</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className='pagination'>
					<button
						onClick={() => handlePageChange(pagination.currentPage - 1)}
						disabled={pagination.currentPage === 1}
					>
						Назад
					</button>

					<span>
						Страница {pagination.currentPage} из {totalPages}
					</span>

					<button
						onClick={() => handlePageChange(pagination.currentPage + 1)}
						disabled={pagination.currentPage === totalPages}
					>
						Вперед
					</button>

					<select
						value={pagination.itemsPerPage}
						onChange={handleItemsPerPageChange}
					>
						<option value={5}>5 на странице</option>
						<option value={10}>10 на странице</option>
						<option value={20}>20 на странице</option>
						<option value={50}>50 на странице</option>
					</select>
				</div>
			</div>
		</div>
	)
}
