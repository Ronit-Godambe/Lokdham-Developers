fetch("/Common/footer/cfooter.html")

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Footer could not be loaded"
            );

        }

        return response.text();

    })

    .then(data => {

        const footerContainer =
            document.getElementById(
                "footer-container"
            );

        if (footerContainer) {

            footerContainer.innerHTML = data;

        }

    })

    .catch(error => {

        console.error(
            "Footer loading error:",
            error
        );

    });