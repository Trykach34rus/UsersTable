export const fetchUsers = async () => {
	try {
		const response = await fetch('https://dummyjson.com/users?limit=100')
		if (!response.ok) {
			console.log('проблема в сети')
		}
		const data = await response.json()
		return data.users
	} catch (error) {
		console.error(`Ошибка ${error.message}`)
	}
}
