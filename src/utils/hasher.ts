import bcrypt from 'bcryptjs';
const salt = 10;

export const passwordHashed = async (password: string) => {
	return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
	enteredPassword: string,
	hashedPassword: string
) => {
	return bcrypt.compare(enteredPassword, hashedPassword);
};
