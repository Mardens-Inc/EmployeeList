import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {useState} from "react";
import {Icon} from "@iconify/react";
import {useAuth} from "../providers/AuthProvider.tsx";

type AuthProperties = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AuthModal(props: AuthProperties)
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPasswordField, setShowPasswordField] = useState(false);
    const {login, auth, logout, setIsLoggedIn} = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState("");

    const tryLogin = async () =>
    {
        if (isLoggingIn) return;
        if (username === "")
            setUsernameError("Username is required");
        else
            setUsernameError("");
        if (password === "")
            setPasswordError("Password is required");
        else
            setPasswordError("");

        setIsLoggingIn(true);
        const response = await login(username, password);
        if (response.success)
        {
            if (auth.getUserProfile().admin)
            {
                setIsLoggedIn(true);
                props.onClose();
            } else
            {
                setError(`You are not permitted to access this!`);
                logout();
            }
        } else
        {
            setError(response.message);
        }

        setIsLoggingIn(false);
    };
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader>Administrator Login</ModalHeader>
                        <ModalBody>
                            <p className={"text-tiny italic"}>
                                This login is intended for <span className="font-bold text-primary underline">administrative purposes only</span>. If you are uncertain about your access, please consult your <span className="text-blue-500 font-bold">administrator</span>.
                            </p>

                            <div className={"flex flex-col gap-3"}>
                                <Input
                                    label={"Username"}
                                    size={"sm"}
                                    value={username}
                                    onValueChange={setUsername}
                                    onKeyUp={async e =>
                                    {
                                        if (e.key === "Enter")
                                            await tryLogin();
                                    }}
                                    isInvalid={usernameError !== ""}
                                    errorMessage={usernameError}
                                    endContent={<Icon icon="mage:email-opened-fill"/>}
                                />
                                <Input
                                    label={"Password"}
                                    size={"sm"}
                                    type={showPasswordField ? "text" : "password"}
                                    value={password}
                                    onValueChange={setPassword}
                                    onKeyUp={async e =>
                                    {
                                        if (e.key === "Enter")
                                            await tryLogin();
                                    }}
                                    isInvalid={passwordError !== ""}
                                    errorMessage={passwordError}
                                    endContent={
                                        <Icon
                                            icon={showPasswordField ? "mage:eye-off" : "mage:eye-fill"}
                                            onClick={() => setShowPasswordField(prev => !prev)}
                                            className={"cursor-pointer"}
                                        />
                                    }
                                />
                                <p className={"text-danger"}>{error}</p>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button
                                isLoading={isLoggingIn}
                                onPress={tryLogin}
                                color={"primary"}
                            >
                                Login
                            </Button>
                            <Button onPress={onClose} variant={"light"} color={"danger"}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}