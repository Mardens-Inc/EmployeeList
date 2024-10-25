import {useEffect, useState} from "react";
import $ from "jquery";
import {cn} from "@nextui-org/react";

export default function UploadOverlay()
{
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingOverKRDP, setisDraggingOverKRDP] = useState(false);
    const [isDraggingOverEmployees, setIsDraggingOverEmployees] = useState(false);

    useEffect(() =>
    {
        const mardensDropArea = $("#mardens-employees-drop-area");
        const krdpDropArea = $("#krdp-employees-list-drop-area");

        $(document).off("dragover");
        $(document).off("dragexit");
        mardensDropArea.off("dragover");
        mardensDropArea.off("dragexit");
        mardensDropArea.off("drop");
        krdpDropArea.off("dragover");
        krdpDropArea.off("dragexit");
        krdpDropArea.off("drop");


        $(document).on("dragover", (e) =>
        {
            e.preventDefault();
            setIsDragging(true);
        }).on("dragexit", () =>
        {
            setIsDragging(false);
        });

        mardensDropArea.on("dragover", (e) =>
        {
            e.preventDefault();
            setIsDraggingOverEmployees(true);
        }).on("dragexit", () =>
        {
            setIsDraggingOverEmployees(false);
        }).on("drop", (e) =>
        {
            e.preventDefault();
            setIsDraggingOverEmployees(false);
            setIsDragging(false);
            console.log(e);
        });

        krdpDropArea.on("dragover", (e) =>
        {
            e.preventDefault();
            setisDraggingOverKRDP(true);
        }).on("dragexit", () =>
        {
            setisDraggingOverKRDP(false);
        })
            .on("drop", (e) =>
            {
                e.preventDefault();
                setisDraggingOverKRDP(false);
                setIsDragging(false);
                console.log(e);
            });


    }, []);

    return (
        <div
            className={
                cn(
                    "fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex flex-row items-center justify-end px-8 gap-8",
                    "opacity-0 pointer-events-none data-[is-dragging=true]:opacity-100 data-[is-dragging=true]:pointer-events-auto transition-all"
                )
            }
            data-is-dragging={isDragging}
        >

            <div
                id={"mardens-employees-drop-area"}
                className={"rounded-lg border-1 border-primary w-1/2 h-4/5 bg-primary/10 z-50 backdrop-blur-sm flex items-center justify-center opacity-30 data-[is-dragging-over=true]:opacity-100 transition-all"}
                data-is-dragging-over={isDraggingOverEmployees}
            >
                <p className={"text-4xl text-primary"}>Mardens Employees List</p>
            </div>
            <div
                id={"krdp-employees-list-drop-area"}
                className={"rounded-lg border-1 border-primary w-1/2 h-4/5 bg-primary/10 z-50 backdrop-blur-sm flex items-center justify-center opacity-30 data-[is-dragging-over=true]:opacity-100 transition-all"}
                data-is-dragging-over={isDraggingOverKRDP}
            >
                <p className={"text-4xl text-primary"}>KRDP Employees List</p>
            </div>

        </div>
    );
}