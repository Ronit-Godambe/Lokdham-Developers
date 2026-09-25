/* ========================================
   LOAD COMMON FOOTER
======================================== */

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


        if (!footerContainer) {

            return;

        }


        footerContainer.innerHTML = data;


        /* ========================================
           LOKDHAM 8-DIGIT VISITOR COUNTER
        ======================================== */

        const counterContainer =
            document.getElementById(
                "lokdham-visitor-counter"
            );


        if (!counterContainer) {

            return;

        }


        const odometer =
            counterContainer.querySelector(
                ".visitor-odometer"
            );


        if (!odometer) {

            return;

        }


        /* ========================================
           HIDDEN STATS4U COUNTER
        ======================================== */

        const statsCounter =
            document.createElement("div");


        statsCounter.id =
            "stats4u-hidden-counter";


        statsCounter.style.position =
            "absolute";


        statsCounter.style.width =
            "1px";


        statsCounter.style.height =
            "1px";


        statsCounter.style.overflow =
            "hidden";


        statsCounter.style.opacity =
            "0";


        statsCounter.style.pointerEvents =
            "none";


        statsCounter.style.left =
            "-9999px";


        document.body.appendChild(
            statsCounter
        );


        const statsScript =
            document.createElement("script");


        statsScript.src =
            "https://www.stats4u.net/s4u.js";


        statsScript.setAttribute(
            "data-id",
            "4493884481"
        );


        statsScript.setAttribute(
            "data-style",
            "950"
        );


        statsScript.setAttribute(
            "data-params",
            "form=odometer&pal=carbon&dark=1"
        );


        statsScript.setAttribute(
            "data-metric",
            "unique"
        );


        statsScript.async = true;


        statsCounter.appendChild(
            statsScript
        );


        /* ========================================
           GET STATS4U TOTAL
        ======================================== */

        fetch(
            "https://www.stats4u.net/live/4493884481/stats.json"
        )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Stats4U statistics could not be loaded"
                    );

                }

                return response.json();

            })


            .then(stats => {

                console.log(
                    "Stats4U data:",
                    stats
                );


                /* ========================================
                   FIND TOTAL VISITORS
                ======================================== */

                let total = 0;


                if (
                    stats &&
                    stats.totals &&
                    typeof stats.totals.visitors !==
                        "undefined"
                ) {

                    total =
                        Number(
                            stats.totals.visitors
                        );

                }


                else if (
                    stats &&
                    stats.total &&
                    typeof stats.total.visitors !==
                        "undefined"
                ) {

                    total =
                        Number(
                            stats.total.visitors
                        );

                }


                else if (
                    stats &&
                    typeof stats.visitors !==
                        "undefined"
                ) {

                    total =
                        Number(
                            stats.visitors
                        );

                }


                /* ========================================
                   SAFETY CHECK
                ======================================== */

                if (
                    !Number.isFinite(total)
                ) {

                    console.error(
                        "Could not find visitor total:",
                        stats
                    );

                    return;

                }


                /* ========================================
                   ALWAYS SHOW 8 DIGITS
                ======================================== */

                const formatted =
                    String(
                        Math.floor(total)
                    )
                    .slice(-8)
                    .padStart(
                        8,
                        "0"
                    );


                const digits =
                    odometer.querySelectorAll(
                        "span"
                    );


                digits.forEach(
                    (digit, index) => {

                        digit.textContent =
                            formatted[index];

                    }
                );


                console.log(
                    "Lokdham visitor count:",
                    formatted
                );

            })


            .catch(error => {

                console.error(
                    "Visitor counter error:",
                    error
                );

            });

    })


    .catch(error => {

        console.error(
            "Footer loading error:",
            error
        );

    });