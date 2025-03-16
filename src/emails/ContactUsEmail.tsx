import {
	Body,
	Column,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_URL ?? `http://localhost:3000`;

interface ContactUsEmailProps {
	firstName: string;
}

const ContactUsEmail = ({
	firstName,
}: ContactUsEmailProps): React.JSX.Element => (
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
					<Link href={process.env.NEXT_PUBLIC_URL}>
						<Img
							src={`${baseUrl}/logos/logo.png`}
							width="220"
							alt="Webflexrr"
							className="mx-auto my-20"
						/>
					</Link>
					<Section>
						<Text className="text-base">
							Dear <u>{firstName},</u>
						</Text>
						<Row>
							<Text className="text-base">
								Thank you for contacting us at Webflexrr Digital Services🚀. We
								appreciate you taking the time to reach out to us.
							</Text>

							<Text className="text-base">
								Our team is committed to providing exceptional service, and we
								are excited to assist you with your inquiry. One of our
								representatives will review your message shortly and will get
								back to you as soon as possible.
							</Text>
							<Text className="text-base">
								In the meantime, if you have any urgent matters or additional
								information to share, please feel free to contact us directly at{' '}
								<Link href="mailto:business@webflexrr.com">
									business@webflexrr.com
								</Link>
								.
							</Text>
							<Text className="text-base">
								Thank you once again for reaching out to us. We look forward to
								connecting with you soon!
							</Text>
						</Row>
					</Section>

					<Section className="mt-5 text-left">
						<Text className="mb-2 mt-0 text-base">Best regards,</Text>
						<Row className="border border-black">
							<Text className="my-0 text-base">Tejodeep Mitra Roy</Text>
							<Text className="my-0 text-base">CTO</Text>
							<Text className="my-0 text-base">Webflexrr Digital Services</Text>
							<Link
								href="mailto:tejodeepmitraroy@webflexrr.com"
								className="my-0"
							>
								tejodeepmitraroy@webflexrr.com
							</Link>
						</Row>
					</Section>
				</Container>

				<Container className="mt-20 ">
					<Row>
						<Column className="px-20 text-right">
							<Link href="https://www.webflexrr.com/">Home</Link>
						</Column>
						<Column className=" text-center">
							<Link href="https://www.webflexrr.com/#services">Services</Link>
						</Column>
						<Column className=" text-center">
							<Link href="https://www.webflexrr.com/#plans">Pricing</Link>
						</Column>
						<Column className="px-20 text-left">
							<Link href="https://www.webflexrr.com/blogs">Blog</Link>
						</Column>
					</Row>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default ContactUsEmail;
