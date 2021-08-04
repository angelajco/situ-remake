/** @see https://soshace.com/react-user-login-authentication-using-usecontext-and-usereducer/ */

import axios from 'axios'

export async function loginUser(dispatch, loginPayload) {

    var bodyFormData = new FormData();
    bodyFormData.append('username', loginPayload.username);
    bodyFormData.append('password', loginPayload.password);
    var config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
    };

	try {
		dispatch({ type: 'REQUEST_LOGIN' });
		let response = await axios.post(`${process.env.ruta}/login`,bodyFormData,config);
		
		if (response.data.username) {
			dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
            localStorage.setItem('currentUser', JSON.stringify(response.data));
			return response.data;
		}

		dispatch({ type: 'LOGIN_ERROR', error: response.data });
		return;
	} catch (error) {
		dispatch({ type: 'LOGIN_ERROR', error: error });
		return { data: { "message-subject": "Error de Autenticación", message:error.message } };
	}
}

export async function logout(dispatch, csfrToken) {
	let requestHeaders = {};
	requestHeaders[`${csfrToken.headerName}`]=csfrToken.token;
	let response = await axios.get(`${process.env.ruta}/logout`,{headers: requestHeaders, withCredentials: true});
	if(response && response.data && response.data.logout === 'ok'){
		dispatch({ type: 'LOGOUT' });
		localStorage.removeItem('currentUser');
	}
}