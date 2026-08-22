fetch("/Common/navbar/cnavbar.html")

    .then(response => response.text())

    .then(data => {

        document.getElementById("navbar-container").innerHTML = data;


        /* ========================================
                MOBILE MENU TOGGLE
        ======================================== */

        const menu = document.getElementById("menu-toggle");
        const navLinks = document.getElementById("nav-links");
        const nav = document.querySelector("nav");

        menu.addEventListener("click", () => {

            navLinks.classList.toggle("active");

            menu.innerHTML =
                navLinks.classList.contains("active") ? "✕" : "☰";

        });


        /* ========================================
                HIDE / SHOW NAVBAR ON SCROLL
        ======================================== */

        let lastScrollTop = 0;

        window.addEventListener("scroll", function () {

            /* Only run on mobile */

            if (window.innerWidth <= 768) {

                let currentScroll =
                    window.pageYOffset ||
                    document.documentElement.scrollTop;


                /* Scrolling DOWN */

                if (
                    currentScroll > lastScrollTop &&
                    currentScroll > 75
                ) {

                    nav.classList.add("nav-hidden");

                } else {

                    /* Scrolling UP */

                    nav.classList.remove("nav-hidden");

                }

                lastScrollTop =
                    currentScroll <= 0
                        ? 0
                        : currentScroll;
            }

        });

    });