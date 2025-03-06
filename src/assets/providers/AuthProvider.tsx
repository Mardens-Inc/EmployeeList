import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import Authentication, {LoginResponse} from "../ts/authentication.ts";
import AuthModal from "../components/AuthModal.tsx";

interface AuthContextType
{
    auth: Authentication;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    login: (username: string, password: string) => Promise<LoginResponse>;
    logout: () => void;
    showLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) =>
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [auth] = useState(() => new Authentication());
    const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn);

    useEffect(() =>
    {
        auth.loginWithTokenFromCookie()
            .then((response: LoginResponse | boolean) =>
            {
                if (typeof response === "boolean")
                {
                    setIsLoggedIn(response);
                } else
                {
                    if (response) setIsLoggedIn(true);
                }
            });
    }, [auth]);

    const login = useCallback((username: string, password: string) => auth.login(username, password), [auth]);
    const logout = useCallback(() => auth.logout(), [auth]);

    const showLoginModal = useCallback(() => setIsModalOpen(true), []);
    const closeLoginModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <AuthContext.Provider value={{auth, isLoggedIn, setIsLoggedIn, login, logout, showLoginModal, closeLoginModal}}>
            <AuthModal isOpen={isModalOpen} onClose={closeLoginModal}/>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType =>
{
    const context = useContext(AuthContext);
    if (!context)
    {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
