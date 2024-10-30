import $ from "jquery";

export type Employee = {
    id: number;
    first_name: string;
    last_name: string;
    location: string;
}

export type EmployeeResponse = {
    count: number;
    last_page: number;
    employees: Employee[];

}

export default class Employees
{
    static async list(limit: number, page: number): Promise<EmployeeResponse>
    {
        return $.get(`/api/?limit=${limit}&page=${page}`);
    }

    static async search(query: string, signal: AbortSignal): Promise<Employee[]>
    {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
            signal: signal
        });
        return await response.json() as Employee[];
    }

    static async upload(file: File): Promise<number>
    {
        type Result = {
            count: number;
        }
        const result: Result = await $.ajax({
            url: "/api/import",
            method: "POST",
            "headers": {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            data: file,
            contentType: false,
            processData: false
        }) as Result;

        return result.count;
    }

    static async upload_krdp(file: File): Promise<number>
    {
        type Result = {
            count: number;
        }
        const result: Result = await $.ajax({
            url: "/api/import/krdp",
            method: "POST",
            "headers": {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            data: file,
            contentType: false,
            processData: false
        }) as Result;

        return result.count;
    }

}