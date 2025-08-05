import './UserModal.css'

export default function UserModal({ user, onClose, isOpen }) {
	if (!isOpen || !user) return null

	const fullName = [user.firstName, user.lastName, user.maidenName]
		.filter(Boolean)
		.join(' ')

	return (
		<div className='modal-overlay' onClick={onClose}>
			<div className='modal-content' onClick={e => e.stopPropagation()}>
				<div className='user-header'>
					{user.image ? (
						<img src={user.image} alt={fullName} className='user-image' />
					) : (
						<div className='user-image-placeholder'>
							{user.firstName?.[0]}
							{user.lastName?.[0]}
						</div>
					)}
					<h2>{fullName}</h2>
					<button className='close-button' onClick={onClose}>
						&times;
					</button>
				</div>

				<div className='user-details'>
					<div className='detail-row'>
						<span className='detail-label'>Возраст:</span>
						<span>{user.age || '—'}</span>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Адрес:</span>
						<span>
							{[
								user.address?.address,
								user.address?.city,
								user.address?.state,
								user.address?.postalCode,
								user.address?.country,
							]
								.filter(Boolean)
								.join(', ')}
						</span>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Рост:</span>
						<span>{user.height || '—'} см</span>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Вес:</span>
						<span>{user.weight || '—'} кг</span>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Телефон:</span>
						<span>{user.phone || '—'}</span>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Email:</span>
						<a href={`mailto:${user.email}`}>{user.email || '—'}</a>
					</div>

					<div className='detail-row'>
						<span className='detail-label'>Дата рождения:</span>
						<span>{user.birthDate || '—'}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
