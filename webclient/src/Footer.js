import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';

import { scene } from './spaceport/scene';

export const Footer = () => {
	const footerRef = useRef();

	useEffect(() => {
		if (!footerRef.current) return;
		if (footerRef.current.clientWidth < 650) return
		if (window.location.hostname === 'my.protospace.ca') scene({ ref: footerRef });
	}, [footerRef]);

	return (
		<div className="footer" ref={footerRef}>
			<Container className="footer-content">
				<p>
					<Link to='/debug'>
						<img
							alt="site logo"
							src="/logo-short.svg"
							className="logo"
						/>
					</Link>
				</p>

				<p className="text">
					Contact us:{' '}
					<a
						href="mailto:info@dvslc.ca"
						target="_blank"
						rel="noopener noreferrer"
					>
						info@dvslc.ca
					</a>
				</p>

				<p className="text">
					Created and hosted by DVSLC members for DVSLC members.
				</p>

				<p className="text">
					Spaceport is free and open-source software.{' '}
					<a
						href="https://github.com/KentBrockman/spaceport"
						target="_blank"
						rel="noopener noreferrer"
					>
						View the source code and license on GitHub.
					</a>{' '}

				</p>

				<p>
					<a
						href="https://instagram.com/sustainablediamondvalley"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="link to our instagram"
					>
						<Icon name="instagram" size="large" />
					</a>
					<a
						href="https://facebook.com/SustainableDiamondValley"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="link to our facebook"
					>
						<Icon name="facebook" size="large" />
					</a>
					<a
						href="https://docs.my.dvslcmaker.space"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="link to our docs"
					>
						<Icon name="book" size="large" />
					</a>
				</p>

				<p>© 2023-{new Date().getFullYear()} Diamond Valley Sustainable Living Centre.</p>
			</Container>
		</div>
	);
};