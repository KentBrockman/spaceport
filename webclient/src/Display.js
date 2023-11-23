import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { Button, Container, Header } from 'semantic-ui-react';
import { requester } from './utils.js';
import { TrotecUsage } from './Usage.js';

const deviceNames = {
	'trotec': {title: 'Trotec', device: 'TROTECS300'},
};

export function LCARS1Display(props) {
	const { token } = props;
	const [fullElement, setFullElement] = useState(false);
	const ref = useRef(null);

	const goFullScreen = () => {
		if ('wakeLock' in navigator) {
			navigator.wakeLock.request('screen');
		}

		ref.current.requestFullscreen({ navigationUI: 'hide' }).then(() => {
			setFullElement(true);
		});
	};

	return (
		<Container>
			<div className='display' ref={ref}>

				{!fullElement &&
					<p>
						<Button onClick={goFullScreen}>Fullscreen</Button>
					</p>
				}

				<div className='display-scores'>
					<DisplayMonthlyScores />
				</div>

				<div className='display-scores'>
					<DisplayHosting />
				</div>

				<div className='display-scores'>
					<DisplayMonthlyHosting />
				</div>

				<div className='display-usage'>
					<DisplayUsage token={token} name={'trotec'} />
				</div>
			</div>
		</Container>
	);
};

export function LCARS2Display(props) {
	const { token } = props;
	const [fullElement, setFullElement] = useState(false);
	const ref = useRef(null);

	const goFullScreen = () => {
		if ('wakeLock' in navigator) {
			navigator.wakeLock.request('screen');
		}

		ref.current.requestFullscreen({ navigationUI: 'hide' }).then(() => {
			setFullElement(true);
		});
	};

	return (
		<Container>
			<div className='display' ref={ref}>

				{!fullElement &&
					<p>
						<Button onClick={goFullScreen}>Fullscreen</Button>
					</p>
				}

				<div className='display-scores'>
					<DisplayScores />
				</div>

				<div className='display-graphs'>
					<iframe src="https://ps-grafana.dns.t0.vc/d-solo/CmQHr8c4z/sensors?from=now-3h&to=now&orgId=1&theme=dark&panelId=2&refresh=1m" width="100%" height="50%" frameborder="0"></iframe>
					<iframe src="https://ps-grafana.dns.t0.vc/d-solo/CmQHr8c4z/sensors?from=now-3h&to=now&orgId=1&theme=dark&panelId=4&refresh=1m" width="100%" height="50%" frameborder="0"></iframe>
				</div>

				<div className='display-graphs'>
					<iframe src="https://ps-grafana.dns.t0.vc/d-solo/CmQHr8c4z/sensors?from=now-3h&to=now&orgId=1&theme=dark&panelId=6&refresh=1m" width="100%" height="50%" frameborder="0"></iframe>
					<iframe src="https://ps-grafana.dns.t0.vc/d-solo/CmQHr8c4z/sensors?from=now-3h&to=now&orgId=1&theme=dark&panelId=8&refresh=1m" width="100%" height="50%" frameborder="0"></iframe>
				</div>

				<div className='display-scores'>
					<DisplayHosting />
				</div>
			</div>
		</Container>
	);
};

export function DisplayUsage(props) {
	const { token, name } = props;
	const title = deviceNames[name].title;
	const device = deviceNames[name].device;
	const [usage, setUsage] = useState(false);

	const getUsage = () => {
		requester('/stats/usage_data/?device='+device, 'GET', token)
		.then(res => {
			setUsage(res);
		})
		.catch(err => {
			console.log(err);
			setUsage(false);
		});
	};

	useEffect(() => {
		getUsage();
		const interval = setInterval(getUsage, 60000);
		return () => clearInterval(interval);
	}, []);

	const inUse = usage && moment().unix() - usage.track.time <= 60;
	const showUsage = usage && inUse && usage.track.username === usage.username;

	return (
		<>
			<Header size='large'>Trotec Usage</Header>

			{showUsage ?
				<TrotecUsage usage={usage} />
			:
				<p className='stat'>
					Waiting for job
				</p>
			}
		</>
	);
};

export function DisplayScores(props) {
	const { token, name } = props;
	const [scores, setScores] = useState(false);

	const getScores = () => {
		requester('/pinball/high_scores/', 'GET')
		.then(res => {
			setScores(res);
		})
		.catch(err => {
			console.log(err);
			setScores(false);
		});
	};

	useEffect(() => {
		getScores();
		const interval = setInterval(getScores, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Header size='large'>Pinball High Scores</Header>

			{scores && scores.slice(0, 5).map((x, i) =>
				<div key={i}>
					<Header size='medium'>#{i+1} — {x.name}. {i === 0 ? '👑' : ''}</Header>
					<p>{x.score.toLocaleString()}</p>
				</div>
			)}

		</>
	);
};

export function DisplayMonthlyScores(props) {
	const { token, name } = props;
	const [scores, setScores] = useState(false);

	const getScores = () => {
		requester('/pinball/monthly_high_scores/', 'GET')
		.then(res => {
			setScores(res);
		})
		.catch(err => {
			console.log(err);
			setScores(false);
		});
	};

	useEffect(() => {
		getScores();
		const interval = setInterval(getScores, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Header size='large'>Monthly High Scores</Header>

			{scores && scores.slice(0, 5).map((x, i) =>
				<div key={i}>
					<Header size='medium'>#{i+1} — {x.name}. {i === 0 ? '🧙' : ''}</Header>
					<p>{x.score.toLocaleString()}</p>
				</div>
			)}

		</>
	);
};

export function DisplayHosting(props) {
	const { token, name } = props;
	const [scores, setScores] = useState(false);

	const getScores = () => {
		requester('/hosting/high_scores/', 'GET')
		.then(res => {
			setScores(res);
		})
		.catch(err => {
			console.log(err);
			setScores(false);
		});
	};

	useEffect(() => {
		getScores();
		const interval = setInterval(getScores, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Header size='large'>Most Host</Header>

			{scores && scores.slice(0, 5).map((x, i) =>
				<div key={i}>
					<Header size='medium'>#{i+1} — {x.name}. {i === 0 ? <img className='toast' src='/toast.png' /> : ''}</Header>
					<p>{x.hours.toFixed(2)} hours</p>
				</div>
			)}

		</>
	);
};

export function DisplayMonthlyHosting(props) {
	const { token, name } = props;
	const [scores, setScores] = useState(false);

	const getScores = () => {
		requester('/hosting/monthly_high_scores/', 'GET')
		.then(res => {
			setScores(res);
		})
		.catch(err => {
			console.log(err);
			setScores(false);
		});
	};

	useEffect(() => {
		getScores();
		const interval = setInterval(getScores, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Header size='large'>Monthly Most Host</Header>

			{scores && scores.slice(0, 5).map((x, i) =>
				<div key={i}>
					<Header size='medium'>#{i+1} — {x.name}. {i === 0 ? '🚀' : ''}</Header>
					<p>{x.hours.toFixed(2)} hours</p>
				</div>
			)}

		</>
	);
};
