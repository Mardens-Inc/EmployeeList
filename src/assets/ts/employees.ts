import $ from "jquery";

export type Employee = {
    employee_id: number;
    first_name: string;
    last_name: string;
    location: string;
}

export default class Employees
{
    static async list(): Promise<Employee[]>
    {
        return $.get("https://employees.mardens.com/api/");
        // return $.get("/api/employees");
    }

    static async search(query: string, signal: AbortSignal): Promise<Employee[]>
    {
        const response = await fetch(`https://employees.mardens.com/api/search?q=${encodeURIComponent(query)}`, {
            signal: signal
        });
        return await response.json() as Employee[];
    }

    static async upload(file: File): Promise<void>
    {
        const formData = new FormData();
        formData.append("file", file);
        return $.ajax({
            url: "/api/employees/upload",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false
        });
    }

}