import {startLoading, stopLoading} from 'https://cdn.jsdelivr.net/gh/Drew-Chase/ChaseUI@24e448eb71ee33daffa7f58b65e6704a5d80676a/js/loading.js';
import {alert, openPopup, closePopup} from 'https://cdn.jsdelivr.net/gh/Drew-Chase/ChaseUI@24e448eb71ee33daffa7f58b65e6704a5d80676a/js/popup.js';

/**
 * @typedef Employee
 * @property {number} employee_id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} location
 */

const main = $("main");
const nav = $("nav");
const table = $("table");
const input = $("nav input");
let debounce = 0;

$(input).on('keyup', async () => {
    await search(input.val())
});
$(input).on('focusout', async () => {
    await search(input.val())
});

$(window).on('load', async () => {
    if (window.location.pathname.startsWith("/search")) {
        const params = new URLSearchParams(window.location.search);
        if (params.get("q") == null) window.history.replaceState({}, document.title, "/");
        $("nav input").val(params.get("q"));
        await search(params.get("q"));
    } else {
    }
})

async function search(query) {
    if (query === "") {
        nav.removeClass("active")
        main.removeClass("active")
        window.history.replaceState({}, document.title, "/");
        return;
    }
    nav.addClass("active")
    main.addClass("active")
    window.history.replaceState({}, document.title, `/search?q=${query}`);
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
        try {

            const response = (await $.get(`${window.location.hostname === "localhost" ? "http://employees.local" : ""}/api/search?q=${encodeURIComponent(query)}`));
            const body = table.find('tbody');
            body.empty();
            Array.from(response).forEach((employee) => {
                const row = $(`
                    <tr>
                        <td>${employee.employee_id}</td>
                        <td>${employee.first_name}</td>
                        <td>${employee.last_name}</td>
                        <td>${employee.location}</td>
                    </tr>
                `)
                body.append(row);
            });


        } catch (err) {
            alert("An error occurred while searching. Please try again later.");
        }
    }, 100);

}

$("#discounts").on("click", () => {
    openPopup("/assets/popups/discounts");
});