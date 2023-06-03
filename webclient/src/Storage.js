import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import './light.css';
import { MembersDropdown } from './Members.js';
import { isAdmin, BasicTable, requester, useIsMobile } from './utils.js';
import { Button, Container, Form, Grid, Header, Icon, Message, Segment, Table } from 'semantic-ui-react';

export function StorageEditor(props) {
	const { token, input, setInput, error } = props;

	const handleValues = (e, v) => setInput({ ...input, [v.name]: v.value });
	const handleChange = (e) => handleValues(e, e.currentTarget);

	const makeProps = (name) => ({
		name: name,
		onChange: handleChange,
		value: input[name] || '',
		error: error[name],
	});

	return (
		<div className='transaction-editor'>
			<Form.Field error={error.member_id}>
				<label>Owner (search)</label>
				<MembersDropdown
					token={token}
					{...makeProps('member_id')}
					onChange={handleValues}
					initial={input.member_name}
					autofocus={!input.member_name}
				/>
			</Form.Field>

			<Form.Input
				label='Memo'
				fluid
				{...makeProps('memo')}
			/>
		</div>
	);
};

function EditStorage(props) {
	const { storage, setStorage, token, refreshUser } = props;
	const [input, setInput] = useState(storage);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { id } = useParams();
	const history = useHistory();

	const handleSubmit = (e) => {
		if (loading) return;
		setLoading(true);
		setSuccess(false);
		const data = { ...input };
		return requester('/storage/'+id+'/', 'PUT', token, data)
		.then(res => {
			setLoading(false);
			setSuccess(true);
			setError(false);
			setInput(res);
			setStorage(res);
		})
		.catch(err => {
			setLoading(false);
			console.log(err);
			setError(err.data);
		});
	};

	const saveAndNext = (e) => {
		e.preventDefault();

		handleSubmit(e)
		.then(res => {
			setStorage(false);
			history.push('/storage/' + (parseInt(id) + 1));
		});
	};

	return (
		<div>
			<Header size='medium'>Edit Storage {storage.shelf_id}</Header>

			<Form onSubmit={handleSubmit}>
				<Form.Button floated='right' onClick={saveAndNext} loading={loading} error={error.non_field_errors}>
					Save and edit next
				</Form.Button>

				<StorageEditor token={token} input={input} setInput={setInput} error={error} />

				<Form.Group widths='equal'>
					<Form.Button loading={loading} error={error.non_field_errors}>
						Save
					</Form.Button>
				</Form.Group>
				{success && <div>Success!</div>}
			</Form>
		</div>
	);
};

function StorageTable(props) {
	const { storage, user } = props;

	const locations = {
		member_shelves: 'Member Shelves',
		lockers: 'Lockers',
		large_project_storage: 'Large Project Storage',
	};

	return (
		<BasicTable>
			<Table.Body>
				<Table.Row>
					<Table.Cell>Shelf ID:</Table.Cell>
					<Table.Cell>{storage.shelf_id}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>Owner:</Table.Cell>
					{storage.member_id ?
						<Table.Cell>
							<Link to={'/members/'+storage.member_id}>
								{storage.member_name}
							</Link>
						</Table.Cell>
					:
						<Table.Cell>None</Table.Cell>
					}
				</Table.Row>
				<Table.Row>
					<Table.Cell>Location:</Table.Cell>
					<Table.Cell>
						{locations[storage.location]}
						<p>
							Aisle {storage.shelf_id[0]} <br/>
							Column {storage.shelf_id[1]} <br/>
							Row {storage.shelf_id[2]}
						</p>
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>Memo:</Table.Cell>
					<Table.Cell>{storage.memo || 'None'}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</BasicTable>
	);
}

export function StorageDetail(props) {
	const { token, user } = props;
	const [storage, setStorage] = useState(false);
	const [error, setError] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		requester('/storage/' + id + '/', 'GET', token)
		.then(res => {
			setStorage(res);
			setError(false);
		})
		.catch(err => {
			console.log(err);
			setError(true);
		});
	}, [id]);

	return (
		<Container>
			{!error ?
				storage ?
					<div>
						<Header size='large'>Storage Location</Header>

						<p><Link to={'/storage'}>View the list of all storage locations.</Link></p>

						<Grid stackable columns={2}>
							<Grid.Column width={6}>
								<StorageTable user={user} storage={storage} />
							</Grid.Column>

							<Grid.Column width={10}>
								{isAdmin(user) ?
									<Segment padded>
										<EditStorage storage={storage} setStorage={setStorage} token={token} {...props} />
									</Segment>
								:
									<Segment padded>
										<Header size='medium'>Report Storage</Header>

										<p>If there's anything wrong with this storage location please email the Protospace Directors:</p>
										<p><a href='mailto:directors@protospace.ca' target='_blank' rel='noopener noreferrer'>directors@protospace.ca</a></p>
										<p>Please include a link to this storage location and any relevant details.</p>
									</Segment>
								}
							</Grid.Column>
						</Grid>

					</div>
				:
					<p>Loading...</p>
			:
				<p>Error loading.</p>
			}
		</Container>
	);
};

export function StorageButton(props) {
	const { storage } = props;
	const history = useHistory();

	const buttonColors = {
		member_shelves: 'grey',
		lockers: 'blue',
		large_project_storage: 'brown',
	};

	const handleStorageButton = (e, id) => {
		e.preventDefault();
		history.push('/storage/' + id);
	};

	return (
		<Button
			className='storage-button'
			onClick={(e) => handleStorageButton(e, storage.id)}
			size='tiny'
			color={buttonColors[storage.location]}
		>
			{storage.shelf_id}
		</Button>
	);
};

export function StorageList(props) {
	const { token } = props;
	const [storageList, setStorageList] = useState(false);
	const [error, setError] = useState(false);
	const isMobile = useIsMobile();

	useEffect(() => {
		requester('/storage/', 'GET', token)
		.then(res => {
			setStorageList(res.results);
			setError(false);
		})
		.catch(err => {
			console.log(err);
			setError(true);
		});
	}, []);

	return (
		<div>
			<p>
				<Icon name='circle' color='grey' /> Member shelf <br/>
				<Icon name='circle' color='blue' /> Locker <br/>
				<Icon name='circle' color='brown' /> Large project storage
			</p>
			{!error ?
				storageList ?
					<Table basic='very'>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Shelf ID</Table.HeaderCell>
								<Table.HeaderCell>Owner</Table.HeaderCell>
								<Table.HeaderCell>Memo</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{storageList.map(x =>
								<Table.Row key={x.id}>
									<Table.Cell><StorageButton storage={x} /></Table.Cell>
									<Table.Cell>
										{isMobile && 'Owner: '}<Link to={'/members/'+x.member_id}>{x.member_name}</Link>
									</Table.Cell>
									<Table.Cell>{isMobile && 'Memo: '}{x.memo}</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				:
					<p>Loading...</p>
			:
				<p>Error loading.</p>
			}
		</div>
	);
};

export function Storage(props) {
	const { token, user } = props;

	return (
		<Container>
			<Header size='large'>Storage Locations</Header>

			<StorageList {...props} />
		</Container>
	);
};

export function ClaimShelfForm(props) {
	const { token, user, refreshUser } = props;
	const member = user.member;
	const [input, setInput] = useState({});
	const [error, setError] = useState({});
	const [loading, setLoading] = useState(false);
	const history = useHistory();

	const handleValues = (e, v) => setInput({ ...input, [v.name]: v.value });
	const handleChange = (e) => handleValues(e, e.currentTarget);

	const handleSubmit = (e) => {
		if (loading) return;
		setLoading(true);
		requester('/storage/claim/', 'POST', token, input)
		.then(res => {
			setError({});
			refreshUser();
			history.push('/');
		})
		.catch(err => {
			setLoading(false);
			console.log(err);
			setError(err.data);
		});
	};

	const makeProps = (name) => ({
		name: name,
		onChange: handleChange,
		value: input[name] || '',
		error: error[name],
	});

	return (
		<Form onSubmit={handleSubmit}>
			<div className='field'>
				<label>Spaceport Username</label>
				<p>{user.username}</p>
			</div>

			<Form.Input
				label='Shelf ID'
				autoComplete='off'
				required
				{...makeProps('shelf_id')}
				maxLength={3}
			/>

			<Form.Button loading={loading} error={error.non_field_errors || error.detail}>
				Submit
			</Form.Button>
		</Form>
	);
};

export function ClaimShelf(props) {
	const { token, user } = props;

	return (
		<Container>
			<Grid stackable columns={2}>
				<Grid.Column>
					<Header size='large'>Claim Member Shelf</Header>

					<p>Use this form to claim a member shelf.</p>

					<p>Please make sure your name and contact info are visible on the shelf.</p>

					<p>Use the Shelf ID visible on the corner label (A1A, A2B, etc.)</p>

					<ClaimShelfForm {...props} />
				</Grid.Column>
			</Grid>
		</Container>
	);
};