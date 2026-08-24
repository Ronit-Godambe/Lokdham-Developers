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

     .goldtxt{
        color: #b89541;
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
                lokdhamPreloaderAppear 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;

        }


        /* =========================================
           LOGO
        ========================================= */

        .lokdham-preloader-logo {

            width: 260px;

            max-width: 75vw;

            height: auto;

            display: block;

            margin-bottom: 30px;

            filter: drop-shadow(
                0 12px 20px rgba(11, 42, 91, 0.10)
            );

        }


        /* =========================================
           TAGLINE
        ========================================= */

        .lokdham-preloader-tagline {

            margin: 0;

            color: #0B2A5B;

            font-family: 'Poppins', sans-serif;

            font-size: 20px;

            font-weight: 600;

            letter-spacing: 1px;

            position: relative;

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

            0% {

                opacity: 0;

                transform:
                    translateY(25px)
                    scale(0.96);

            }

            100% {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media screen and (max-width: 768px) {

            .lokdham-preloader-logo {

                width: 210px;

                max-width: 75vw;

                margin-bottom: 26px;

            }


            .lokdham-preloader-tagline {

                font-size: 16px;

                font-weight: 600;

                letter-spacing: 0.6px;

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
                src="img/index/lokdhamtm.png"
                alt="Lokdham Developers"
                class="lokdham-preloader-logo"
            >

            <p class="lokdham-preloader-tagline">

                Building Trust. <span class="goldtxt"> Creating Future.</span>

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
           GET LOGO
        ================================ */

        const logo = preloader.querySelector(
            ".lokdham-preloader-logo"
        );


        /* ================================
           SAVE SHOW TIME
        ================================ */

        localStorage.setItem(

            PRELOADER_KEY,

            Date.now().toString()

        );


        /* ================================
           START PRELOADER TIMER
           ONLY AFTER LOGO IS READY
        ================================ */

        function startPreloaderTimer() {

            setTimeout(function () {

                preloader.classList.add("hide");

                document.body.style.overflow = "";


                setTimeout(function () {

                    preloader.remove();

                }, FADE_TIME);

            }, DISPLAY_TIME);

        }


        /* ================================
           WAIT FOR LOGO TO LOAD
        ================================ */

        if (logo.complete && logo.naturalWidth > 0) {

            startPreloaderTimer();

        } else {

            logo.addEventListener(

                "load",

                startPreloaderTimer,

                { once: true }

            );


            /* FALLBACK IF IMAGE FAILS */

            logo.addEventListener(

                "error",

                startPreloaderTimer,

                { once: true }

            );

        }

    }


    /* ================================
       START IMMEDIATELY
    ================================ */

    addPreloader();

})();