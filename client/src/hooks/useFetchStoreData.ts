import { useAppSelector } from 'redux/hooks';

export const useFetchUserData = () => {
  const { token, userData, isLoggedIn } = useAppSelector(
    (state) => state.user.data
  );
  return { token, userData, isLoggedIn };
};
