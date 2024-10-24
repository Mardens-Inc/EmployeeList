import {Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import Employees, {Employee} from "../ts/employees.ts";
import {useEffect, useState} from "react";
import {useSearch} from "../providers/SearchProvider.tsx";


export default function Home()
{
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageItems, setPageItems] = useState<Employee[]>([]);
    const {search} = useSearch();
    const itemsPerPage = 30;
    let abortController = new AbortController();

    useEffect(() =>
    {
        if (search)
        {
            abortController.abort();
            abortController = new AbortController();
            const signal = abortController.signal;
            if (currentPage !== 1) setCurrentPage(1);
            Employees.search(search, signal).then(setEmployees);
        } else Employees.list().then(setEmployees);
    }, [search]);

    useEffect(() =>
    {
        setTotalPages(Math.ceil(employees.length / itemsPerPage));
    }, [employees, itemsPerPage]);

    useEffect(() =>
    {
        setPageItems(employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [currentPage, employees, itemsPerPage]);

    return (
        <div className={"m-8 relative flex flex-col justify-center"}>

            <Table
                aria-label={"Employees Table"}
                isHeaderSticky
                className={"max-h-[calc(100dvh_-_190px)] overflow-auto"}
                classNames={{
                    wrapper: "rounded-lg shadow-lg bg-neutral-200 dark:bg-[#18181b]"
                }}
            >
                <TableHeader>
                    <TableColumn key={"id"} aria-label="Employee ID">Employee ID</TableColumn>
                    <TableColumn key={"firstName"} aria-label="First Name">First Name</TableColumn>
                    <TableColumn key={"lastName"} aria-label="Last Name">Last Name</TableColumn>
                    <TableColumn key={"location"} aria-label="Location">Location</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Results Found!"}>
                    {pageItems.map((e) => (
                        <TableRow key={e.employee_id}>
                            <TableCell>{e.employee_id}</TableCell>
                            <TableCell className={"capitalize"}>{e.first_name.toLowerCase()}</TableCell>
                            <TableCell className={"capitalize"}>{e.last_name.toLowerCase()}</TableCell>
                            <TableCell>{e.location}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                total={totalPages}
                onChange={setCurrentPage}
                page={currentPage}
                showControls
                showShadow
                className={"mx-auto mt-4"}
            />
        </div>
    );
}