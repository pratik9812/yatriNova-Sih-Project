/* =========================================
   YATRANOVA - SMART TOURISM ENGINE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------
       DEMO TOURISM DATA
    ----------------------------------------- */

    const destinations = [
        {
            name: "Jaipur Heritage Trail",
            state: "Rajasthan",
            description: "Historic architecture, local culture and authentic experiences.",
            categories: ["Heritage", "Culture", "Food"],
            cost: 3500,
            crowd: "Medium",
            distance: 0,
            baseScore: 88,
            image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80"
        },

        {
            name: "Agra Beyond the Taj",
            state: "Uttar Pradesh",
            description: "Discover heritage, crafts and local experiences beyond the Taj Mahal.",
            categories: ["Heritage", "Culture", "Food"],
            cost: 3200,
            crowd: "Medium",
            distance: 0,
            baseScore: 84,
            image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80"
        },

        {
            name: "Hidden Himalayan Escape",
            state: "Himachal Pradesh",
            description: "Peaceful mountain experiences, nature trails and local stays.",
            categories: ["Nature", "Adventure", "Culture"],
            cost: 4800,
            crowd: "Low",
            distance: 0,
            baseScore: 90,
            image: "https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1000&q=80"
        },

        {
            name: "Bodh Gaya Spiritual Trail",
            state: "Bihar",
            description: "Explore Buddhist heritage, peaceful surroundings and local culture.",
            categories: ["Heritage", "Culture"],
            cost: 2800,
            crowd: "Medium",
            distance: 0,
            baseScore: 89,
            image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=80"
        },

        {
            name: "Udaipur Lakeside Experience",
            state: "Rajasthan",
            description: "Lakes, heritage streets, local food and cultural experiences.",
            categories: ["Heritage", "Food", "Culture", "Nature"],
            cost: 4200,
            crowd: "Medium",
            distance: 0,
            baseScore: 87,
            image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80"
        },

        {
            name: "Rishikesh Nature & Adventure",
            state: "Uttarakhand",
            description: "Nature, river-side experiences and outdoor activities.",
            categories: ["Nature", "Adventure"],
            cost: 4000,
            crowd: "High",
            distance: 0,
            baseScore: 86,
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
        }
    ];


    /* -----------------------------------------
       DOM ELEMENTS
    ----------------------------------------- */

    const destinationInput =
        document.querySelector(".input-box input");

    const selects =
        document.querySelectorAll(".input-box select");

    const budgetSelect = selects[0];
    const durationSelect = selects[1];

    const planButton =
        document.querySelector(".plan-btn");

    const interests =
        document.querySelectorAll(".interest");


    /* -----------------------------------------
       INTEREST SELECTION
    ----------------------------------------- */

    interests.forEach(button => {

        button.addEventListener("click", () => {

            interests.forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

        });

    });


    /* -----------------------------------------
       GET USER INTEREST
    ----------------------------------------- */

    function getSelectedInterest() {

        const active =
            document.querySelector(".interest.active");

        if (!active) return "Heritage";

        return active.textContent.trim();

    }


    /* -----------------------------------------
       GET BUDGET VALUE
    ----------------------------------------- */

    function getBudget() {

        const value = budgetSelect.value;

        if (value.includes("5,000")) return 5000;
        if (value.includes("10,000")) return 10000;
        if (value.includes("25,000")) return 25000;

        return 50000;

    }


    /* -----------------------------------------
       GET DAYS
    ----------------------------------------- */

    function getDays() {

        const value = durationSelect.value;

        if (value.includes("1 Day")) return 1;
        if (value.includes("2 Days")) return 2;
        if (value.includes("3 Days")) return 3;
        if (value.includes("4-7")) return 5;
        if (value.includes("7+")) return 8;

        return 2;

    }


    /* -----------------------------------------
       TOURISM OPPORTUNITY ENGINE
    ----------------------------------------- */

    function calculateScore(place, interest, budget) {

        let score = place.baseScore;

        /* Interest Match */

        if (
            place.categories.some(category =>
                category.toLowerCase() === interest.toLowerCase()
            )
        ) {
            score += 6;
        } else {
            score -= 5;
        }


        /* Budget Fit */

        if (place.cost <= budget) {

            score += 5;

        } else {

            score -= 12;

        }


        /* Crowd Suitability */

        if (place.crowd === "Low") {

            score += 5;

        } else if (place.crowd === "High") {

            score -= 4;

        }


        /* Keep score within 0-100 */

        return Math.max(0, Math.min(100, score));

    }


    /* -----------------------------------------
       FIND DESTINATIONS
    ----------------------------------------- */

    function getRecommendations(destination, interest, budget) {

        let results = [...destinations];

        const search = destination.toLowerCase().trim();

        if (search) {

            const exactMatches = results.filter(place =>
                place.name.toLowerCase().includes(search) ||
                place.state.toLowerCase().includes(search)
            );

            if (exactMatches.length > 0) {

                results = exactMatches;

            }

        }


        results = results.map(place => {

            return {
                ...place,
                score: calculateScore(
                    place,
                    interest,
                    budget
                )
            };

        });


        results.sort((a, b) => b.score - a.score);

        return results.slice(0, 3);

    }


    /* -----------------------------------------
       CREATE RESULTS SECTION
    ----------------------------------------- */

    function showResults(results, destination, budget, days, interest) {

        let oldResults =
            document.querySelector(".results-section");

        if (oldResults) {
            oldResults.remove();
        }


        const section =
            document.createElement("section");

        section.className = "results-section";


        const cards = results.map((place, index) => {

            const matchText =
                place.score >= 90
                    ? "Excellent Match"
                    : place.score >= 80
                        ? "Great Match"
                        : "Good Match";


            return `
                <article class="result-card">

                    <div class="result-image">

                        <img
                            src="${place.image}"
                            alt="${place.name}"
                        >

                        <div class="result-score">
                            <i class="fa-solid fa-star"></i>
                            ${place.score}
                        </div>

                        ${index === 0
                            ? `<span class="best-match">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                Best Match
                               </span>`
                            : ""
                        }

                    </div>


                    <div class="result-content">

                        <div class="result-location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${place.state}, India
                        </div>

                        <h3>${place.name}</h3>

                        <p>${place.description}</p>


                        <div class="result-details">

                            <span>
                                <i class="fa-solid fa-users"></i>
                                ${place.crowd} Crowd
                            </span>

                            <span>
                                <i class="fa-solid fa-wallet"></i>
                                ₹${place.cost.toLocaleString()}
                            </span>

                            <span>
                                <i class="fa-solid fa-heart"></i>
                                ${place.categories[0]}
                            </span>

                        </div>


                        <div class="match-info">

                            <div>
                                <strong>${matchText}</strong>
                                <small>
                                    Based on your preferences
                                </small>
                            </div>

                            <button
                                class="itinerary-btn"
                                data-place="${place.name}"
                            >
                                View Trip
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");


        section.innerHTML = `

            <div class="results-container">

                <div class="results-heading">

                    <div>

                        <span class="eyebrow">
                            AI RECOMMENDATION
                        </span>

                        <h2>
                            Your personalized
                            <span>travel opportunities</span>
                        </h2>

                        <p>
                            Based on ${interest}, ₹${budget.toLocaleString()}
                            budget and ${days} day${days > 1 ? "s" : ""} trip.
                        </p>

                    </div>

                    <div class="result-count">
                        ${results.length} recommendations
                    </div>

                </div>


                <div class="result-grid">
                    ${cards}
                </div>


                <div class="engine-note">

                    <div class="engine-icon">
                        <i class="fa-solid fa-brain"></i>
                    </div>

                    <div>

                        <strong>
                            Why these recommendations?
                        </strong>

                        <p>
                            YatraNova evaluates interest match,
                            budget fit, crowd suitability and
                            local tourism opportunity to rank
                            destinations.
                        </p>

                    </div>

                </div>

            </div>

        `;


        document
            .querySelector("main")
            .appendChild(section);


        addResultStyles();


        section.scrollIntoView({
            behavior: "smooth"
        });


        /* Itinerary buttons */

        document
            .querySelectorAll(".itinerary-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const placeName =
                        button.dataset.place;

                    showItinerary(
                        placeName,
                        days,
                        budget,
                        interest
                    );

                });

            });

    }


    /* -----------------------------------------
       PLAN TRIP
    ----------------------------------------- */

    planButton.addEventListener("click", () => {

        const destination =
            destinationInput.value.trim();

        const budget =
            getBudget();

        const days =
            getDays();

        const interest =
            getSelectedInterest();


        if (!destination) {

            destinationInput.focus();

            destinationInput.style.border =
                "2px solid #ff6b35";

            setTimeout(() => {

                destinationInput.style.border =
                    "none";

            }, 1800);

            alert(
                "Please enter a destination first."
            );

            return;

        }


        planButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Finding...
        `;

        planButton.disabled = true;


        setTimeout(() => {

            const results =
                getRecommendations(
                    destination,
                    interest,
                    budget
                );


            showResults(
                results,
                destination,
                budget,
                days,
                interest
            );


            planButton.innerHTML = `
                <span>Plan My Trip</span>
                <i class="fa-solid fa-arrow-right"></i>
            `;

            planButton.disabled = false;

        }, 900);

    });


    /* -----------------------------------------
       ITINERARY
    ----------------------------------------- */

    function showItinerary(
        placeName,
        days,
        budget,
        interest
    ) {

        const place =
            destinations.find(
                item => item.name === placeName
            );


        let old =
            document.querySelector(".itinerary-modal");

        if (old) old.remove();


        const modal =
            document.createElement("div");

        modal.className =
            "itinerary-modal";


        let itineraryHTML = "";


        for (let day = 1; day <= days; day++) {

            if (day > 5) break;

            itineraryHTML += `

                <div class="day-card">

                    <div class="day-number">
                        Day ${day}
                    </div>

                    <div class="day-content">

                        <div>
                            <span>09:00 AM</span>
                            <strong>
                                Morning exploration
                            </strong>
                        </div>

                        <div>
                            <span>01:00 PM</span>
                            <strong>
                                Local food experience
                            </strong>
                        </div>

                        <div>
                            <span>04:00 PM</span>
                            <strong>
                                ${interest} experience
                            </strong>
                        </div>

                        <div>
                            <span>07:00 PM</span>
                            <strong>
                                Local market / cultural experience
                            </strong>
                        </div>

                    </div>

                </div>

            `;

        }


        modal.innerHTML = `

            <div class="modal-overlay">

                <div class="itinerary-box">

                    <button class="close-modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>


                    <span class="eyebrow">
                        PERSONALIZED ITINERARY
                    </span>

                    <h2>
                        ${placeName}
                    </h2>

                    <p class="modal-subtitle">
                        ${days} day journey ·
                        Budget ₹${budget.toLocaleString()} ·
                        ${interest}
                    </p>


                    <div class="itinerary-summary">

                        <div>
                            <i class="fa-solid fa-star"></i>
                            <span>
                                Smart Match
                            </span>
                        </div>

                        <div>
                            <i class="fa-solid fa-wallet"></i>
                            <span>
                                Budget Friendly
                            </span>
                        </div>

                        <div>
                            <i class="fa-solid fa-leaf"></i>
                            <span>
                                Local Experience
                            </span>
                        </div>

                    </div>


                    <div class="days-container">

                        ${itineraryHTML}

                    </div>


                    <button class="close-bottom">
                        Done
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        document
            .querySelector(".close-modal")
            .addEventListener(
                "click",
                () => modal.remove()
            );


        document
            .querySelector(".close-bottom")
            .addEventListener(
                "click",
                () => modal.remove()
            );

    }


    /* -----------------------------------------
       HEART / SAVE BUTTONS
    ----------------------------------------- */

    document
        .querySelectorAll(".save-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const icon =
                        button.querySelector("i");

                    icon.classList.toggle(
                        "fa-regular"
                    );

                    icon.classList.toggle(
                        "fa-solid"
                    );

                    button.classList.toggle(
                        "saved"
                    );

                }
            );

        });


    /* -----------------------------------------
       DYNAMIC RESULT CSS
    ----------------------------------------- */

    function addResultStyles() {

        if (
            document.querySelector(
                "#result-styles"
            )
        ) return;


        const style =
            document.createElement("style");

        style.id = "result-styles";

        style.textContent = `

            .results-section {
                background: #f5f8fb;
                padding: 95px 24px;
            }

            .results-container {
                max-width: 1160px;
                margin: auto;
            }

            .results-heading {
                display: flex;
                justify-content: space-between;
                align-items: end;
                margin-bottom: 35px;
                gap: 25px;
            }

            .results-heading h2 {
                font-family: "Playfair Display", serif;
                font-size: 40px;
                line-height: 1.15;
                color: #102a43;
                margin-bottom: 10px;
            }

            .results-heading h2 span {
                color: #ff6b35;
            }

            .results-heading p {
                color: #627d98;
                font-size: 13px;
            }

            .result-count {
                padding: 9px 13px;
                background: white;
                border: 1px solid #e5eaf0;
                border-radius: 9px;
                color: #627d98;
                font-size: 11px;
                font-weight: 700;
            }

            .result-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }

            .result-card {
                overflow: hidden;
                background: white;
                border: 1px solid #e5eaf0;
                border-radius: 18px;
                transition: 0.3s ease;
            }

            .result-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 18px 45px rgba(16,42,67,0.10);
            }

            .result-image {
                height: 220px;
                position: relative;
            }

            .result-image img {
                height: 100%;
            }

            .result-score {
                position: absolute;
                top: 12px;
                left: 12px;
                background: white;
                padding: 7px 10px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 800;
                color: #102a43;
            }

            .result-score i {
                color: #f59e0b;
            }

            .best-match {
                position: absolute;
                bottom: 12px;
                left: 12px;
                padding: 7px 10px;
                background: #ff6b35;
                color: white;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 700;
            }

            .result-content {
                padding: 20px;
            }

            .result-location {
                color: #ff6b35;
                font-size: 10px;
                font-weight: 700;
                margin-bottom: 7px;
            }

            .result-content h3 {
                color: #102a43;
                font-size: 18px;
                margin-bottom: 7px;
            }

            .result-content > p {
                color: #627d98;
                font-size: 12px;
                line-height: 1.6;
                min-height: 58px;
            }

            .result-details {
                display: flex;
                flex-wrap: wrap;
                gap: 7px;
                margin: 16px 0;
            }

            .result-details span {
                padding: 6px 8px;
                background: #f5f7f9;
                border-radius: 7px;
                color: #627d98;
                font-size: 9px;
                font-weight: 600;
            }

            .result-details i {
                color: #ff6b35;
                margin-right: 3px;
            }

            .match-info {
                border-top: 1px solid #e5eaf0;
                padding-top: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }

            .match-info strong {
                display: block;
                color: #102a43;
                font-size: 11px;
            }

            .match-info small {
                display: block;
                color: #8a9bad;
                font-size: 8px;
                margin-top: 2px;
            }

            .itinerary-btn {
                padding: 9px 11px;
                background: #102a43;
                color: white;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 700;
                white-space: nowrap;
            }

            .itinerary-btn:hover {
                background: #ff6b35;
            }

            .engine-note {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 30px;
                padding: 18px;
                background: white;
                border: 1px solid #e5eaf0;
                border-radius: 14px;
            }

            .engine-icon {
                min-width: 42px;
                height: 42px;
                border-radius: 11px;
                background: #fff0ea;
                color: #ff6b35;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .engine-note strong {
                color: #102a43;
                font-size: 12px;
            }

            .engine-note p {
                color: #627d98;
                font-size: 10px;
                margin-top: 3px;
            }


            /* MODAL */

            .itinerary-modal {
                position: fixed;
                inset: 0;
                z-index: 5000;
            }

            .modal-overlay {
                width: 100%;
                height: 100%;
                padding: 20px;
                background: rgba(5,18,30,0.72);
                backdrop-filter: blur(7px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .itinerary-box {
                position: relative;
                width: min(760px, 100%);
                max-height: 90vh;
                overflow-y: auto;
                padding: 32px;
                background: white;
                border-radius: 22px;
                box-shadow: 0 30px 80px rgba(0,0,0,0.30);
            }

            .close-modal {
                position: absolute;
                top: 18px;
                right: 18px;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: #f3f5f7;
                color: #243b53;
            }

            .itinerary-box h2 {
                color: #102a43;
                font-family: "Playfair Display", serif;
                font-size: 34px;
                margin-bottom: 5px;
            }

            .modal-subtitle {
                color: #627d98;
                font-size: 12px;
            }

            .itinerary-summary {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin: 22px 0;
            }

            .itinerary-summary div {
                padding: 8px 10px;
                background: #fff7f3;
                color: #ff6b35;
                border-radius: 8px;
                font-size: 10px;
                font-weight: 700;
            }

            .day-card {
                display: grid;
                grid-template-columns: 80px 1fr;
                border: 1px solid #e5eaf0;
                border-radius: 13px;
                margin-bottom: 12px;
                overflow: hidden;
            }

            .day-number {
                background: #102a43;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                font-weight: 700;
            }

            .day-content {
                padding: 14px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .day-content div {
                display: flex;
                flex-direction: column;
            }

            .day-content span {
                color: #ff6b35;
                font-size: 9px;
                font-weight: 700;
            }

            .day-content strong {
                color: #243b53;
                font-size: 11px;
                margin-top: 2px;
            }

            .close-bottom {
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                border-radius: 9px;
                background: #102a43;
                color: white;
                font-weight: 700;
            }

            @media (max-width: 800px) {

                .result-grid {
                    grid-template-columns: 1fr;
                }

                .results-heading {
                    flex-direction: column;
                    align-items: start;
                }

                .results-heading h2 {
                    font-size: 32px;
                }

            }

            @media (max-width: 600px) {

                .results-section {
                    padding: 70px 18px;
                }

                .itinerary-box {
                    padding: 22px;
                }

                .day-card {
                    grid-template-columns: 1fr;
                }

                .day-number {
                    padding: 9px;
                }

                .day-content {
                    grid-template-columns: 1fr;
                }

            }

        `;

        document.head.appendChild(style);

    }

});