import {types} from "../types/types";

export const LogInAction = (token, name, email, role, photo) => {
    return (dispatch) => {
        dispatch(login(token, name, email, role, photo));
    };
};

export const login = (token, name, email, role, photo) => ({
    type: types.login,
    payload: {
        token,
        name,
        email,
        role,
        photo
    },
});

export const LogoutAction = () => {
    return (dispatch) => {
        dispatch(logout());
        localStorage.removeItem('_token');
    };
};

export const logout = () => ({
    type: types.logout,
});
