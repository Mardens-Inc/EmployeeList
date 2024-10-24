import $ from "jquery";

export type Employee = {
    id: number;
    first_name: string;
    last_name: string;
    location: string;
}

export default class Employees
{
    static async list(): Promise<Employee[]>
    {
        return $.get("/api/employees");
    }

    static async search(query: string, signal: AbortSignal): Promise<Employee[]>
    {
        const response = await fetch(`/api/employees/search?query=${encodeURIComponent(query)}`, {
            signal: signal
        });
        return await response.json() as Employee[];
    }

    static async upload(file: File): Promise<void>
    {
        return $.ajax({
            url: "/api/import",
            method: "POST",
            "headers": {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            data: file,
            contentType: false,
            processData: false
        });
    }
    static async upload_krdp(file: File): Promise<void>{
        return $.ajax({
            url: "/api/import/krdp",
            method: "POST",
            "headers": {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            data: file,
            contentType: false,
            processData: false
        });
    }

}