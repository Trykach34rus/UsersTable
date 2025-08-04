import './App.css'
import UserTable from './componets/UserTable/UserTable'

function App() {
	return (
		<div className='app'>
			<h1 className='title'>Таблица пользователей</h1>
			<UserTable />
			{/* <UserModal /> */}
		</div>
	)
}

export default App
