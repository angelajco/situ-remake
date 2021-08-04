import { useEffect } from "react";
import { useAuthDispatch} from '../context';

export default function LoggedUserLoader () {

    const dispatch = useAuthDispatch();

    useEffect(() => {
        let userDetails = localStorage.getItem('currentUser')
            ? JSON.parse(localStorage.getItem('currentUser'))
            : {};
        if (userDetails.username) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: userDetails });
        }
      }, []);


    return null;
}
