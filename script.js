/* =========================================
   YATRANOVA - SMART TOURISM ENGINE
   Local-image + recommendation demo
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const destinations = [
        {
            name: "Jaipur Heritage Trail",
            state: "Rajasthan",
            description: "Historic architecture, local culture and authentic experiences.",
            categories: ["Heritage", "Culture", "Food"],
            cost: 3500,
            crowd: "Medium",
            baseScore: 88,
            image: "image/annie-spratt-slTVVuk7hZU-unsplash.jpg"
        },
        {
            name: "Agra Beyond the Taj",
            state: "Uttar Pradesh",
            description: "Discover heritage, crafts and local experiences beyond the Taj Mahal.",
            categories: ["Heritage", "Culture", "Food"],
            cost: 3200,
            crowd: "Medium",
            baseScore: 84,
            image: "image/derek-story-ws208Ry7fbk-unsplash.jpg"
        },
        {
            name: "Hidden Himalayan Escape",
            state: "Himachal Pradesh",
            description: "Peaceful mountain experiences, nature trails and local stays.",
            categories: ["Nature", "Adventure", "Culture"],
            cost: 4800,
            crowd: "Low",
            baseScore: 90,
            image: "image/sukant-sharma-b6rs6V_9lH4-unsplash.jpg"
        },
        {
            name: "Bodh Gaya Spiritual Trail",
            state: "Bihar",
            description: "Explore Buddhist heritage, peaceful surroundings and local culture.",
            categories: ["Heritage", "Culture"],
            cost: 2800,
            crowd: "Medium",
            baseScore: 89,
            image: "image/rishu-bhosale-URPvbncq-4M-unsplash.jpg"
        },
        {
            name: "Udaipur Lakeside Experience",
            state: "Rajasthan",
            description: "Lakes, heritage streets, local food and cultural experiences.",
            categories: ["Heritage", "Food", "Culture", "Nature"],
            cost: 4200,
            crowd: "Medium",
            baseScore: 87,
            image: "image/annie-spratt-slTVVuk7hZU-unsplash.jpg"
        },
        {
            name: "Rishikesh Nature & Adventure",
            state: "Uttarakhand",
            description: "Nature, river-side experiences and outdoor activities.",
            categories: ["Nature", "Adventure"],
            cost: 4000,
            crowd: "High",
            baseScore: 86,
            image: "image/rishu-bhosale-URPvbncq-4M-unsplash.jpg"
        }
    ];

    const destinationInput = document.querySelector(".input-box input");
    const selects = document.querySelectorAll(".input-box select");
    const budgetSelect = selects[0];
    const durationSelect = selects[1];
    const planButton = document.querySelector(".plan-btn");
    const interests = document.querySelectorAll(".interest");

    if (!destinationInput || !planButton || !budgetSelect || !durationSelect) return;

    interests.forEach(button => {
        button.addEventListener("click", () => {
            interests.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });

    function getSelectedInterest() {
        const active = document.querySelector(".interest.active");
        return active ? active.textContent.trim() : "Heritage";
    }

    function getBudget() {
        const value = budgetSelect.value;
        if (value.includes("5,000")) return 5000;
        if (value.includes("10,000")) return 10000;
        if (value.includes("25,000")) return 25000;
        return 50000;
    }

    function getDays() {
        const value = durationSelect.value;
        if (value.includes("1 Day")) return 1;
        if (value.includes("2 Days")) return 2;
        if (value.includes("3 Days")) return 3;
        if (value.includes("4-7")) return 5;
        if (value.includes("7+")) return 8;
        return 2;
    }

    function calculateScore(place, interest, budget) {
        let score = place.baseScore;
        const match = place.categories.some(c => c.toLowerCase() === interest.toLowerCase());
        score += match ? 6 : -5;
        score += place.cost <= budget ? 5 : -12;
        if (place.crowd === "Low") score += 5;
        if (place.crowd === "High") score -= 4;
        return Math.max(0, Math.min(100, score));
    }

    function getRecommendations(destination, interest, budget) {
        const search = destination.toLowerCase().trim();
        let results = [...destinations];
        if (search) {
            const matches = results.filter(place =>
                place.name.toLowerCase().includes(search) ||
                place.state.toLowerCase().includes(search)
            );
            if (matches.length) results = matches;
        }
        return results
            .map(place => ({ ...place, score: calculateScore(place, interest, budget) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    function showResults(results, budget, days, interest) {
        document.querySelector(".results-section")?.remove();

        const section = document.createElement("section");
        section.className = "results-section";

        section.innerHTML = `
            <div class="results-container">
                <div class="results-heading">
                    <div>
                        <span class="eyebrow">AI RECOMMENDATION</span>
                        <h2>Your personalized <span>travel opportunities</span></h2>
                        <p>Based on ${interest}, ₹${budget.toLocaleString()} budget and ${days} day${days > 1 ? "s" : ""} trip.</p>
                    </div>
                    <div class="result-count">${results.length} recommendations</div>
                </div>
                <div class="result-grid">
                    ${results.map((place, index) => `
                        <article class="result-card">
                            <div class="result-image">
                                <img src="${place.image}" alt="${place.name}" loading="lazy"
                                     onerror="this.onerror=null;this.src='image/sukant-sharma-b6rs6V_9lH4-unsplash.jpg';">
                                <div class="result-score"><i class="fa-solid fa-star"></i> ${place.score}</div>
                                ${index === 0 ? `<span class="best-match"><i class="fa-solid fa-wand-magic-sparkles"></i> Best Match</span>` : ""}
                            </div>
                            <div class="result-content">
                                <div class="result-location"><i class="fa-solid fa-location-dot"></i> ${place.state}, India</div>
                                <h3>${place.name}</h3>
                                <p>${place.description}</p>
                                <div class="result-details">
                                    <span><i class="fa-solid fa-users"></i> ${place.crowd} Crowd</span>
                                    <span><i class="fa-solid fa-wallet"></i> ₹${place.cost.toLocaleString()}</span>
                                    <span><i class="fa-solid fa-heart"></i> ${place.categories[0]}</span>
                                </div>
                                <div class="match-info">
                                    <div>
                                        <strong>${place.score >= 90 ? "Excellent Match" : place.score >= 80 ? "Great Match" : "Good Match"}</strong>
                                        <small>Based on your preferences</small>
                                    </div>
                                    <button class="itinerary-btn" data-place="${place.name}">View Trip <i class="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </div>
                        </article>
                    `).join("")}
                </div>
                <div class="engine-note">
                    <div class="engine-icon"><i class="fa-solid fa-brain"></i></div>
                    <div>
                        <strong>Why these recommendations?</strong>
                        <p>YatraNova evaluates interest match, budget fit, crowd suitability and local tourism opportunity to rank destinations.</p>
                    </div>
                </div>
            </div>`;

        document.querySelector("main").appendChild(section);
        addResultStyles();
        section.scrollIntoView({ behavior: "smooth" });

        section.querySelectorAll(".itinerary-btn").forEach(button => {
            button.addEventListener("click", () => showItinerary(button.dataset.place, days, budget, interest));
        });
    }

    function showItinerary(placeName, days, budget, interest) {
        document.querySelector(".itinerary-modal")?.remove();
        const modal = document.createElement("div");
        modal.className = "itinerary-modal";
        let itineraryHTML = "";

        for (let day = 1; day <= Math.min(days, 5); day++) {
            itineraryHTML += `
                <div class="day-card">
                    <div class="day-number">Day ${day}</div>
                    <div class="day-content">
                        <div><span>09:00 AM</span><strong>Morning exploration</strong></div>
                        <div><span>01:00 PM</span><strong>Local food experience</strong></div>
                        <div><span>04:00 PM</span><strong>${interest} experience</strong></div>
                        <div><span>07:00 PM</span><strong>Local market / cultural experience</strong></div>
                    </div>
                </div>`;
        }

        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="itinerary-box">
                    <button class="close-modal"><i class="fa-solid fa-xmark"></i></button>
                    <span class="eyebrow">PERSONALIZED ITINERARY</span>
                    <h2>${placeName}</h2>
                    <p class="modal-subtitle">${days} day journey · Budget ₹${budget.toLocaleString()} · ${interest}</p>
                    <div class="itinerary-summary">
                        <div><i class="fa-solid fa-star"></i><span>Smart Match</span></div>
                        <div><i class="fa-solid fa-wallet"></i><span>Budget Friendly</span></div>
                        <div><i class="fa-solid fa-leaf"></i><span>Local Experience</span></div>
                    </div>
                    <div class="days-container">${itineraryHTML}</div>
                    <button class="close-bottom">Done</button>
                </div>
            </div>`;

        document.body.appendChild(modal);
        modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
        modal.querySelector(".close-bottom").addEventListener("click", () => modal.remove());
        modal.querySelector(".modal-overlay").addEventListener("click", event => {
            if (event.target.classList.contains("modal-overlay")) modal.remove();
        });
    }

    planButton.addEventListener("click", () => {
        const destination = destinationInput.value.trim();
        const budget = getBudget();
        const days = getDays();
        const interest = getSelectedInterest();

        if (!destination) {
            destinationInput.focus();
            alert("Please enter a destination first.");
            return;
        }

        planButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Finding...`;
        planButton.disabled = true;

        setTimeout(() => {
            showResults(getRecommendations(destination, interest, budget), budget, days, interest);
            planButton.innerHTML = `<span>Plan My Trip</span><i class="fa-solid fa-arrow-right"></i>`;
            planButton.disabled = false;
        }, 500);
    });

    function addResultStyles() {
        if (document.getElementById("yatra-results-style")) return;
        const style = document.createElement("style");
        style.id = "yatra-results-style";
        style.textContent = `
            .results-section{padding:80px 20px;background:#f7f8fa}
            .results-container{max-width:1200px;margin:auto}
            .results-heading{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:35px}
            .results-heading h2{margin:8px 0;font-size:clamp(30px,4vw,48px)}
            .results-heading h2 span{display:block}
            .result-count{font-weight:700;white-space:nowrap}
            .result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
            .result-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08)}
            .result-image{height:230px;position:relative;background:#ddd;overflow:hidden}
            .result-image img{width:100%;height:100%;object-fit:cover;display:block}
            .result-score,.best-match{position:absolute;top:14px;padding:8px 12px;border-radius:999px;background:#fff;font-weight:700}
            .result-score{right:14px}.best-match{left:14px}
            .result-content{padding:22px}.result-location{font-size:13px;font-weight:600;opacity:.7}
            .result-content h3{font-size:23px;margin:10px 0}.result-content p{line-height:1.6;opacity:.75}
            .result-details{display:flex;gap:12px;flex-wrap:wrap;font-size:13px;margin:18px 0}.result-details span{background:#f3f5f7;padding:7px 10px;border-radius:8px}
            .match-info{display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid #eee;padding-top:16px}.match-info small{display:block;opacity:.6;margin-top:3px}
            .itinerary-btn{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}
            @media(max-width:900px){.result-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.result-grid{grid-template-columns:1fr}.results-heading{display:block}.result-count{margin-top:15px}}
        `;
        document.head.appendChild(style);
    }
});