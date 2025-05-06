import { supabase } from '../../services/supabase';

// Inscription
export const register = (email, password) => async dispatch => {
  try {
    dispatch({ type: 'REGISTER_START' });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: { userId: data.user.id },
    });
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAIL',
      payload: error.message,
    });
    throw error;
  }
};

// Connexion
export const login = (email, password) => async dispatch => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token: data.session.access_token,
        user: { email: data.user.email },
      },
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAIL',
      payload: error.message,
    });
    throw error;
  }
};

// Déconnexion
export const logout = () => async dispatch => {
  await supabase.auth.signOut();
  dispatch({ type: 'LOGOUT' });
};
