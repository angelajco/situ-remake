/** @see https://soshace.com/react-user-login-authentication-using-usecontext-and-usereducer/ */


export const initialState = {
	user: {
		username: null,
		nombre: null,
		roles: null,
		csrfToken: null,
		menu: null
	},
	loading: false,
	errorMessage: null,
};


export const AuthReducer = (initialState, action) => {
	switch (action.type) {
		case 'REQUEST_LOGIN':
			return {
				...initialState,
				loading: true,
			};

		case 'LOGIN_SUCCESS':
			return {
				...initialState,
				user: action.payload,
				loading: false,
			};

		case 'LOGOUT':
			return {
				...initialState,
				user: {
					username: null,
					nombre: null,
					roles: null,
					menu: null
				}
			};

		case 'LOGIN_ERROR':
			return {
				...initialState,
				loading: false,
				errorMessage: action.error,
			};

		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};