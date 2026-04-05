import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string }) => {
	await resend.emails.send({
		from: process.env.EMAIL_FROM!,
		to,
		subject,
		text,
	});
};
