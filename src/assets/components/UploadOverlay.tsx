import {useEffect, useState} from "react";
import $ from "jquery";
import {Button, cn, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner} from "@nextui-org/react";
import Employees from "../ts/employees.ts";

export default function UploadOverlay()
{
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingOverKRDP, setisDraggingOverKRDP] = useState(false);
    const [isDraggingOverEmployees, setIsDraggingOverEmployees] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCount, setUploadCount] = useState(0);
    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            const file: File | undefined = e.originalEvent?.dataTransfer?.files[0];
            if (file)
            {
                Employees.upload(file)
                    .then(setUploadCount)
                    .then(() => setShowUploadModal(true))
                    .finally(() =>
                    {
                        setLoading(false);
                        setIsDraggingOverEmployees(false);
                        setIsDragging(false);
                    });
            }
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
                setLoading(true);
                const file: File | undefined = e.originalEvent?.dataTransfer?.files[0];
                if (file)
                {
                    Employees.upload_krdp(file)
                        .then(setUploadCount)
                        .then(() => setShowUploadModal(true)).finally(() =>
                    {
                        setLoading(false);
                        setisDraggingOverKRDP(false);
                        setIsDragging(false);
                    });
                }
            });


    }, []);

    return (
        <>
            <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader>Upload Successful</ModalHeader>
                            <ModalBody>
                                <p>{uploadCount} Employees Uploaded</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
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
                    {loading ? <Spinner size={"lg"}/> :
                        <p className={"text-4xl text-primary"}>Mardens Employees List</p>}
                </div>
                <div
                    id={"krdp-employees-list-drop-area"}
                    className={"rounded-lg border-1 border-primary w-1/2 h-4/5 bg-primary/10 z-50 backdrop-blur-sm flex items-center justify-center opacity-30 data-[is-dragging-over=true]:opacity-100 transition-all"}
                    data-is-dragging-over={isDraggingOverKRDP}
                >
                    {loading ? <Spinner size={"lg"}/> :
                        <p className={"text-4xl text-primary"}>KRDP Employees List</p>}
                </div>

            </div>
        </>
    );
}
