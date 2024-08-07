import {alert} from "https://cdn.jsdelivr.net/gh/Drew-Chase/ChaseUI@24e448eb71ee33daffa7f58b65e6704a5d80676a/js/popup.js";

$("body").on('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    $("body").addClass('dragging');
})
    .on("dragleave", e => {
        e.preventDefault();
        e.stopPropagation();
        $("body").removeClass('dragging');
    })
    .on('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        $("body").removeClass('dragging');
        let data = e.originalEvent.dataTransfer;
        if (data.files.length) {
            const file = data.files[0];
            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                let formData = new FormData();
                formData.append('file', file);
                $.ajax({
                    url: '/api/import',
                    type: 'POST',
                    data: formData,
                    mimeType: "multipart/form-data",
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,  // tell jQuery not to set contentType
                    success: (data) => {
                        data = JSON.parse(data);
                        console.log(data);
                        alert(`Imported ${data["count"]} records`);
                    }
                });
            }
            console.log(file)
        }
    })