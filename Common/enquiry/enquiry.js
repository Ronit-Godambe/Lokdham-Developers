

(function () {

    const ENQUIRY_SHOWN_KEY = "lokdhamEnquiryShown";
    const ENQUIRY_SUBMITTED_KEY = "lokdhamEnquirySubmitted";

    const POPUP_DELAY = 40 * 1000;
    const POPUP_COOLDOWN = 30 * 60 * 1000;
    const SUBMISSION_LOCK = 7 * 24 * 60 * 60 * 1000;


    function shouldShowEnquiry() {

        const now = Date.now();

        const submittedTime =
            localStorage.getItem(ENQUIRY_SUBMITTED_KEY);

        if (submittedTime) {

            const submittedAgo =
                now - Number(submittedTime);

            if (submittedAgo < SUBMISSION_LOCK) {

                return false;

            }

            localStorage.removeItem(
                ENQUIRY_SUBMITTED_KEY
            );

        }


        const shownTime =
            localStorage.getItem(ENQUIRY_SHOWN_KEY);

        if (shownTime) {

            const shownAgo =
                now - Number(shownTime);

            if (shownAgo < POPUP_COOLDOWN) {

                return false;

            }

        }

        return true;

    }


    const style = document.createElement("style");

    style.innerHTML = `

        .enquiry-popup {

            position: fixed;

            inset: 0;

            z-index: 999998;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 20px;

        }


        .enquiry-popup.active {

            display: flex;

        }

        .enquiry-overlay {

            position: absolute;

            inset: 0;

            background: rgba(7, 29, 64, 0.72);

            backdrop-filter: blur(4px);

        }

        .enquiry-modal {

            position: relative;

            width: 100%;

            max-width: 650px;

            max-height: 92vh;

            overflow-y: auto;

            background: #ffffff;

            border-radius: 20px;

            border-top: 5px solid #C8931A;

            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.28);

            z-index: 1;

        }

        .enquiry-close {

            position: absolute;

            top: 18px;

            right: 18px;

            width: 38px;

            height: 38px;

            border: none;

            border-radius: 50%;

            background: #F1F5F9;

            color: #0B2A5B;

            font-size: 28px;

            line-height: 1;

            cursor: pointer;

            z-index: 2;

        }


        /* =========================================
           CONTENT
        ========================================= */

        .enquiry-content {

            padding: 42px;

        }


        /* =========================================
           HEADING
        ========================================= */

        .enquiry-heading {

            margin-bottom: 28px;

        }


        .enquiry-tag {

            display: inline-block;

            margin-bottom: 10px;

            font-family: 'Poppins', sans-serif;

            font-size: 10px;

            font-weight: 700;

            letter-spacing: 2px;

            color: #C8931A;

        }


        .enquiry-heading h2 {

            margin: 0 0 10px;

            font-family: 'Poppins', sans-serif;

            font-size: 29px;

            line-height: 1.25;

            color: #0B2A5B;

        }


        .enquiry-heading p {

            margin: 0;

            font-family: 'Inter', sans-serif;

            font-size: 14px;

            line-height: 1.7;

            color: #1E293B;

        }


        /* =========================================
           FORM
        ========================================= */

        .enquiry-form {

            display: flex;

            flex-direction: column;

            gap: 17px;

        }


        .enquiry-field {

            display: flex;

            flex-direction: column;

            gap: 7px;

        }


        .enquiry-field label {

            font-family: 'Poppins', sans-serif;

            font-size: 13px;

            font-weight: 600;

            color: #0B2A5B;

        }


        .enquiry-field label span {

            color: #C8931A;

        }


        .enquiry-field label small {

            font-size: 11px;

            font-weight: 400;

            color: #64748B;

        }


        /* =========================================
           INPUTS
        ========================================= */

        .enquiry-field input,
        .enquiry-field textarea {

            width: 100%;

            box-sizing: border-box;

            padding: 13px 14px;

            border: 1px solid #E5E7EB;

            border-radius: 8px;

            background: #F8FAFC;

            font-family: 'Inter', sans-serif;

            font-size: 13px;

            color: #1E293B;

            outline: none;

        }


        .enquiry-field input:focus,
        .enquiry-field textarea:focus {

            border-color: #0B2A5B;

            background: #ffffff;

            box-shadow:
                0 0 0 3px rgba(11, 42, 91, 0.08);

        }


        .enquiry-field textarea {

            resize: vertical;

            min-height: 82px;

        }


        /* =========================================
           INTEREST OPTIONS
        ========================================= */

        .interest-options {

            display: grid;

            grid-template-columns: repeat(3, 1fr);

            gap: 10px;

        }


        .interest-option {

            position: relative;

            cursor: pointer;

        }


        .interest-option input {

            position: absolute;

            opacity: 0;

            pointer-events: none;

        }


        .interest-box {

            display: flex;

            flex-direction: column;

            justify-content: center;

            min-height: 78px;

            padding: 12px;

            border: 1px solid #E5E7EB;

            border-radius: 10px;

            background: #F8FAFC;

            transition: all 0.25s ease;

        }


        .interest-box strong {

            font-family: 'Poppins', sans-serif;

            font-size: 12px;

            color: #0B2A5B;

            margin-bottom: 4px;

        }


        .interest-box small {

            font-family: 'Inter', sans-serif;

            font-size: 10px;

            line-height: 1.4;

            color: #64748B;

        }


        .interest-option input:checked + .interest-box {

            border-color: #0B2A5B;

            background: rgba(11, 42, 91, 0.05);

            box-shadow:
                0 0 0 2px rgba(11, 42, 91, 0.08);

        }


        /* =========================================
           SUBMIT BUTTON
        ========================================= */

        .enquiry-submit {

            width: 100%;

            border: none;

            border-radius: 8px;

            padding: 15px;

            background: #0B2A5B;

            color: #ffffff;

            font-family: 'Poppins', sans-serif;

            font-size: 14px;

            font-weight: 600;

            cursor: pointer;

        }


        .enquiry-submit span {

            margin-left: 8px;

        }


        .enquiry-note {

            margin: 0;

            text-align: center;

            font-family: 'Inter', sans-serif;

            font-size: 10px;

            line-height: 1.5;

            color: #64748B;

        }


        /* =========================================
           BODY LOCK
        ========================================= */

        body.enquiry-open {

            overflow: hidden;

        }


        /* =========================================
           MOBILE
        ========================================= */

        @media screen and (max-width: 768px) {

            .enquiry-popup {

                padding: 14px;

            }


            .enquiry-modal {

                width: calc(100% - 28px);

                max-height: 94vh;

                border-radius: 16px;

                border-top-width: 4px;

            }


            .enquiry-content {

                padding: 32px 20px 25px;

            }


            .enquiry-close {

                top: 12px;

                right: 12px;

                width: 34px;

                height: 34px;

                font-size: 24px;

            }


            .enquiry-heading {

                padding-right: 35px;

                margin-bottom: 22px;

            }


            .enquiry-tag {

                font-size: 9px;

                letter-spacing: 1.5px;

            }


            .enquiry-heading h2 {

                font-size: 23px;

                line-height: 1.3;

            }


            .enquiry-heading p {

                font-size: 12px;

                line-height: 1.6;

            }


            .enquiry-form {

                gap: 14px;

            }


            .enquiry-field {

                gap: 6px;

            }


            .enquiry-field label {

                font-size: 12px;

            }


            .enquiry-field input,
            .enquiry-field textarea {

                padding: 12px;

                font-size: 12px;

                border-radius: 7px;

            }


            .interest-options {

                grid-template-columns: 1fr;

                gap: 8px;

            }


            .interest-box {

                min-height: auto;

                padding: 11px 12px;

                flex-direction: row;

                align-items: center;

                gap: 10px;

            }


            .interest-box strong {

                font-size: 11px;

                margin-bottom: 0;

            }


            .interest-box small {

                margin-left: auto;

                text-align: right;

                font-size: 9px;

            }


            .enquiry-submit {

                padding: 13px;

                font-size: 13px;

            }


            .enquiry-note {

                font-size: 9px;

            }

        }

    `;

    document.head.appendChild(style);


    /* =========================================
       CREATE POPUP HTML
    ========================================= */

    const popup = document.createElement("section");

    popup.className = "enquiry-popup";

    popup.id = "enquiryPopup";


    popup.innerHTML = `

        <div class="enquiry-overlay"></div>

        <div class="enquiry-modal">

            <button
                class="enquiry-close"
                type="button"
                aria-label="Close enquiry form"
            >
                &times;
            </button>


            <div class="enquiry-content">

                <div class="enquiry-heading">

                    <span class="enquiry-tag">
                        LOKDHAM DEVELOPERS
                    </span>

                    <h2>
                        Let's Talk About Your Property Plans
                    </h2>

                    <p>
                        Looking to buy a plot or sell your land near Pune?
                        Share your details and our team will get in touch with you.
                    </p>

                </div>


                <form
                    class="enquiry-form"
                    id="enquiryForm"
                >

                    <div class="enquiry-field">

                        <label for="enquiryName">
                            Full Name <span>*</span>
                        </label>

                        <input
                            type="text"
                            id="enquiryName"
                            placeholder="Enter your full name"
                            required
                        >

                    </div>


                    <div class="enquiry-field">

                        <label for="enquiryPhone">
                            Mobile Number <span>*</span>
                        </label>

                        <input
                            type="tel"
                            id="enquiryPhone"
                            placeholder="Enter your mobile number"
                            inputmode="numeric"
                            pattern="[0-9]{10}"
                            maxlength="10"
                            required
                        >

                    </div>


                    <div class="enquiry-field">

                        <label>
                            I am interested in <span>*</span>
                        </label>

                        <div class="interest-options">

                            <label class="interest-option">

                                <input
                                    type="radio"
                                    name="interest"
                                    value="buying"
                                    required
                                >

                                <span class="interest-box">

                                    <strong>
                                        Buying a Plot
                                    </strong>

                                    <small>
                                        Looking for property
                                    </small>

                                </span>

                            </label>


                            <label class="interest-option">

                                <input
                                    type="radio"
                                    name="interest"
                                    value="selling"
                                >

                                <span class="interest-box">

                                    <strong>
                                        Selling Land
                                    </strong>

                                    <small>
                                        Want to sell property
                                    </small>

                                </span>

                            </label>


                            <label class="interest-option">

                                <input
                                    type="radio"
                                    name="interest"
                                    value="other"
                                >

                                <span class="interest-box">

                                    <strong>
                                        Other Enquiry
                                    </strong>

                                    <small>
                                        General enquiry
                                    </small>

                                </span>

                            </label>

                        </div>

                    </div>


                    <div class="enquiry-field">

                        <label for="enquiryEmail">

                            Email

                            <small>
                                Optional
                            </small>

                        </label>

                        <input
                            type="email"
                            id="enquiryEmail"
                            placeholder="Enter your email"
                        >

                    </div>


                    <div class="enquiry-field">

                        <label for="enquiryLocation">

                            Preferred Location <span>*</span>

                        </label>

                        <input
                            type="text"
                            id="enquiryLocation"
                            placeholder="Which location are you interested in?"
                            required
                        >

                    </div>


                    <div class="enquiry-field">

                        <label for="enquiryMessage">

                            Message

                            <small>
                                Optional
                            </small>

                        </label>

                        <textarea
                            id="enquiryMessage"
                            placeholder="Tell us more about your requirement"
                        ></textarea>

                    </div>


                    <button
                        type="submit"
                        class="enquiry-submit"
                    >
                        Submit Enquiry
                        <span>→</span>
                    </button>


                    <p class="enquiry-note">

                        Your information is kept private and will only be used
                        to respond to your enquiry.

                    </p>

                </form>

            </div>

        </div>

    `;


    /* =========================================
       ADD POPUP
    ========================================= */

    function addPopup() {

        if (!document.body) {

            requestAnimationFrame(addPopup);

            return;

        }

        document.body.appendChild(popup);


        /* =========================================
           OPEN POPUP
        ========================================= */

        function openEnquiryPopup() {

            popup.classList.add("active");

            document.body.classList.add(
                "enquiry-open"
            );

        }


        /* =========================================
           CLOSE POPUP
        ========================================= */

        function closeEnquiryPopup() {

            popup.classList.remove("active");

            document.body.classList.remove(
                "enquiry-open"
            );

        }


        /* =========================================
           CLOSE BUTTON
        ========================================= */

        popup.querySelector(
            ".enquiry-close"
        ).addEventListener(
            "click",
            closeEnquiryPopup
        );

        popup.querySelector(
            ".enquiry-overlay"
        ).addEventListener(
            "click",
            closeEnquiryPopup
        );

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    popup.classList.contains("active")
                ) {

                    closeEnquiryPopup();

                }

            }
        );


        setTimeout(function () {

            if (!shouldShowEnquiry()) {

                return;

            }


            openEnquiryPopup();


            localStorage.setItem(

                ENQUIRY_SHOWN_KEY,

                Date.now().toString()

            );

        }, POPUP_DELAY);

        const enquiryForm =
            popup.querySelector("#enquiryForm");


        enquiryForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    popup.querySelector(
                        "#enquiryName"
                    ).value.trim();


                const phone =
                    popup.querySelector(
                        "#enquiryPhone"
                    ).value.trim();


                const email =
                    popup.querySelector(
                        "#enquiryEmail"
                    ).value.trim();


                const location =
                    popup.querySelector(
                        "#enquiryLocation"
                    ).value.trim();


                const message =
                    popup.querySelector(
                        "#enquiryMessage"
                    ).value.trim();


                const selectedInterest =
                    popup.querySelector(
                        'input[name="interest"]:checked'
                    );


                let interest = "";

                if (selectedInterest) {

                    if (
                        selectedInterest.value === "buying"
                    ) {

                        interest = "Buying a Plot";

                    }

                    else if (
                        selectedInterest.value === "selling"
                    ) {

                        interest = "Selling Land";

                    }

                    else {

                        interest = "Other Enquiry";

                    }

                }


                let whatsappMessage =
`Hello Lokdham Developers,

I would like to make an enquiry.

Name: ${name}
Mobile: ${phone}
Interest: ${interest}`;


                if (email) {

                    whatsappMessage +=
`
Email: ${email}`;

                }


                if (location) {

                    whatsappMessage +=
`
Preferred Location: ${location}`;

                }


                if (message) {

                    whatsappMessage +=
`
Message: ${message}`;

                }


                whatsappMessage +=
`

Thank you.`;


                const whatsappNumber =
                    "918007901111";


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

                localStorage.setItem(

                    ENQUIRY_SUBMITTED_KEY,

                    Date.now().toString()

                );


                closeEnquiryPopup();


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }

    addPopup();

})();