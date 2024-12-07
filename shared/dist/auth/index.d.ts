export type AuthState = {
    userId: string | null;
    userLoggedIn: boolean;
    loading: boolean;
    registerError: string | null;
    isNewUser: boolean | null;
    userType: string;
};
