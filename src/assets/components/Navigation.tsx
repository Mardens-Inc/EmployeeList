import {Input, Link, Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle} from "@heroui/react";
import {useSearch} from "../providers/SearchProvider.tsx";
import {useState} from "react";
import DiscountsModal from "./DiscountsModal.tsx";
import ExpandableButton from "./ExpandableButton.tsx";
import {getRealTheme, Themes, useTheme} from "../providers/ThemeProvider.tsx";
import {Icon} from "@iconify/react";
import {useAuth} from "../providers/AuthProvider.tsx";

export default function Navigation()
{
    const {search, setSearch} = useSearch();
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);
    const {theme, setTheme} = useTheme();
    const {isLoggedIn, showLoginModal, logout, setIsLoggedIn} = useAuth();

    return (
        <>
            <DiscountsModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)}/>
            <Navbar maxWidth={"full"}>
                <NavbarContent>
                    <NavbarMenuToggle className="sm:hidden"/>
                    <NavbarBrand>
                        <p className="font-bold text-inherit">Employees List</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4 w-1/2" justify="center">
                    <Input
                        label={"Search"}
                        placeholder={"Search for employees"}
                        size={"sm"}
                        className={"min-w-[200px] w-full"}
                        startContent={<Icon icon="mage:search"/>}
                        value={search}
                        onValueChange={setSearch}
                        autoFocus
                    />
                </NavbarContent>
                <NavbarContent justify="end">
                    <ExpandableButton onPress={() => setIsDiscountModalOpen(true)} color={"primary"} variant={"shadow"} startContent={<Icon icon="mage:tag-2-fill"/>}>View Discounts</ExpandableButton>
                    <ExpandableButton as={Link} href={"https://fm.mardens.com/returns"} startContent={<Icon icon="mage:dashboard-bar-fill"/>}>Back to Dashboard</ExpandableButton>
                    <ExpandableButton
                        startContent={<Icon icon={isLoggedIn ? "mage:user-square-fill" : "mage:lock-fill"}/>}
                        onPress={() =>
                        {
                            if (isLoggedIn)
                            {
                                logout();
                                setIsLoggedIn(false);
                            } else showLoginModal();
                        }}
                    >
                        {isLoggedIn ? "Logout" : "Admin Login"}
                    </ExpandableButton>
                    <ExpandableButton
                        startContent={<Icon icon={getRealTheme(theme) === Themes.LIGHT ? "mage:sun-fill" : "mage:moon-fill"}/>}
                        onPress={() => setTheme(prev => getRealTheme(prev) === Themes.LIGHT ? Themes.DARK : Themes.LIGHT)}
                    >
                        Toggle {theme === Themes.LIGHT ? " Dark" : "Light"}
                    </ExpandableButton>
                </NavbarContent>

            </Navbar>
        </>
    );
}