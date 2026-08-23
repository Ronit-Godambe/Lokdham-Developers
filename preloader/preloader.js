/* =========================================
   LOKDHAM COMMON PRELOADER
   Shows once every 30 minutes
========================================= */

(function () {

    /* ================================
       SETTINGS
    ================================ */

    const PRELOADER_KEY = "lokdhamPreloaderLastShown";

    /* TESTING: 5 seconds */
    const THIRTY_MINUTES = 30 * 60 * 1000;

    const DISPLAY_TIME = 2200;

    const FADE_TIME = 500;


    /* ================================
       CHECK IF PRELOADER SHOULD SHOW
    ================================ */

    const lastShown = localStorage.getItem(PRELOADER_KEY);

    const now = Date.now();

    let shouldShow = true;


    if (lastShown) {

        const timePassed = now - Number(lastShown);

        if (timePassed < THIRTY_MINUTES) {

            shouldShow = false;

        }

    }


    /* ================================
       STOP HERE IF ALREADY SHOWN
    ================================ */

    if (!shouldShow) return;


    /* ================================
       CREATE CSS
    ================================ */

    const style = document.createElement("style");

    style.innerHTML = `

        /* =========================================
           PRELOADER
        ========================================= */

        #lokdham-preloader {

            position: fixed;

            inset: 0;

            width: 100%;

            height: 100vh;

            background: #ffffff;

            display: flex;

            align-items: center;

            justify-content: center;

            z-index: 999999;

            opacity: 1;

            visibility: visible;

            transition:
                opacity ${FADE_TIME}ms ease,
                visibility ${FADE_TIME}ms ease;

        }


        /* =========================================
           CONTENT
        ========================================= */

        .lokdham-preloader-content {

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            text-align: center;

            padding: 20px;

            animation:
                lokdhamPreloaderAppear 0.7s ease forwards;

        }


        /* =========================================
           LOGO
        ========================================= */

        .lokdham-preloader-logo {

            width: 180px;

            max-width: 60vw;

            height: auto;

            display: block;

            margin-bottom: 24px;

        }


        /* =========================================
           TAGLINE
        ========================================= */

        .lokdham-preloader-tagline {

            margin: 0;

            color: #0B2A5B;

            font-family: 'Poppins', sans-serif;

            font-size: 17px;

            font-weight: 500;

            letter-spacing: 0.5px;

        }


        /* =========================================
           FADE OUT
        ========================================= */

        #lokdham-preloader.hide {

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

        }


        /* =========================================
           CONTENT ANIMATION
        ========================================= */

        @keyframes lokdhamPreloaderAppear {

            from {

                opacity: 0;

                transform: translateY(15px);

            }

            to {

                opacity: 1;

                transform: translateY(0);

            }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media screen and (max-width: 768px) {

            .lokdham-preloader-logo {

                width: 140px;

                margin-bottom: 20px;

            }


            .lokdham-preloader-tagline {

                font-size: 14px;

                letter-spacing: 0.3px;

            }

        }

    `;


    document.head.appendChild(style);


    /* ================================
       CREATE PRELOADER HTML
    ================================ */

    const preloader = document.createElement("div");

    preloader.id = "lokdham-preloader";


    preloader.innerHTML = `

        <div class="lokdham-preloader-content">

            <img
                src="img/index/onlylogo.png"
                alt="Lokdham Developers"
                class="lokdham-preloader-logo"
            >

            <p class="lokdham-preloader-tagline">

                Building Trust. Creating Future.

            </p>

        </div>

    `;


    /* ================================
       ADD PRELOADER IMMEDIATELY
    ================================ */

    function addPreloader() {

        if (!document.body) {

            requestAnimationFrame(addPreloader);

            return;

        }


        document.body.appendChild(preloader);

        document.body.style.overflow = "hidden";


        /* ================================
           SAVE SHOW TIME
        ================================ */

        localStorage.setItem(

            PRELOADER_KEY,

            Date.now().toString()

        );


        /* ================================
           REMOVE PRELOADER
        ================================ */

        setTimeout(function () {

            preloader.classList.add("hide");

            document.body.style.overflow = "";


            setTimeout(function () {

                preloader.remove();

            }, FADE_TIME);


        }, DISPLAY_TIME);

    }


    /* START IMMEDIATELY */

    addPreloader();

})();