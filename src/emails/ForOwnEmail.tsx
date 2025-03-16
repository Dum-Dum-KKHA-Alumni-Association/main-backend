import React from 'react';
import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

const baseUrl = process.env.NEXT_PUBLIC_URL ?? `http://localhost:3000`;

interface ForOwnEmailProps {
	firstName: string;
	lastName: string;
	email: string;
	companyName: string;
	additionalMessage: string;
}

const ForOwnEmail = ({
	firstName,
	lastName,
	email,
	companyName,
	additionalMessage,
}: ForOwnEmailProps): React.JSX.Element => {
	return (
		<Html>
			<Head>
				<title>My email title</title>
			</Head>
			<Preview>
				The sales intelligence platform that helps you uncover qualified leads.
			</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: '#2250f4',
								offwhite: '#fafbfb',
							},
							spacing: {
								0: '0px',
								20: '20px',
								45: '45px',
							},
						},
					},
				}}
			>
				<Body className="bg-offwhite font-sans text-base">
					<Container className="p-45 bg-white">
						<Img
							src={`${baseUrl}/logos/logo.png`}
							width="220"
							alt="Webflexrr"
							className="mx-auto my-20"
						/>
						<Section>
							<Text className="text-base">Dear User,</Text>
							<Row>
								<Text className="text-base">
									A new client send a query at Webflexrr Digital Services🚀.
								</Text>
								<Text className="text-base">First name: {firstName}</Text>
								<Text className="text-base">Last name: {lastName}</Text>
								<Text className="text-base">Email: {email}</Text>
								<Text className="text-base">Company Name: {companyName}</Text>
								<Text className="text-base">Additional Message:</Text>
								<Text className="text-base">{additionalMessage}</Text>
							</Row>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ForOwnEmail;
