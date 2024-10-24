import {Button, Input, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle} from "@nextui-org/react";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {useSearch} from "../providers/SearchProvider.tsx";
import {useState} from "react";
import DiscountsModal from "./DiscountsModal.tsx";

export default function Navigation()
{
    const {search, setSearch} = useSearch();
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);

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
                        className={"min-w-[200px] w-full"}
                        startContent={<FontAwesomeIcon icon={faMagnifyingGlass}/>}
                        value={search}
                        onValueChange={setSearch}
                        autoFocus
                    />
                </NavbarContent>
                <NavbarContent justify="end">
                    <Button onClick={() => setIsDiscountModalOpen(true)} color={"primary"} variant={"shadow"}>View Discounts</Button>
                    <Button as={Link} href={"https://fm.mardens.com/returns"} variant={"light"}>Back to Dashboard</Button>
                    <NavbarItem><ThemeSwitcher/></NavbarItem>
                </NavbarContent>

            </Navbar>
        </>
    );
}