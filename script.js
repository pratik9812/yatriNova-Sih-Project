/* =========================================
   YATRANOVA - SMART TOURISM ENGINE
   Smart ranking + local-image recommendation demo
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const destinations = [
        {name:"Jaipur Heritage Trail",state:"Rajasthan",description:"Historic architecture, local culture and authentic experiences.",categories:["Heritage","Culture","Food"],cost:3500,crowd:"Medium",idealDays:[2,3],baseScore:88,image:"image/annie-spratt-slTVVuk7hZU-unsplash.jpg"},
        {name:"Agra Beyond the Taj",state:"Uttar Pradesh",description:"Discover heritage, crafts and local experiences beyond the Taj Mahal.",categories:["Heritage","Culture","Food"],cost:3200,crowd:"Medium",idealDays:[1,2,3],baseScore:84,image:"image/derek-story-ws208Ry7fbk-unsplash.jpg"},
        {name:"Hidden Himalayan Escape",state:"Himachal Pradesh",description:"Peaceful mountain experiences, nature trails and local stays.",categories:["Nature","Adventure","Culture"],cost:4800,crowd:"Low",idealDays:[3,5,7],baseScore:90,image:"image/sukant-sharma-b6rs6V_9lH4-unsplash.jpg"},
        {name:"Bodh Gaya Spiritual Trail",state:"Bihar",description:"Explore Buddhist heritage, peaceful surroundings and local culture.",categories:["Heritage","Culture"],cost:2800,crowd:"Medium",idealDays:[1,2,3],baseScore:89,image:"image/rishu-bhosale-URPvbncq-4M-unsplash.jpg"},
        {name:"Udaipur Lakeside Experience",state:"Rajasthan",description:"Lakes, heritage streets, local food and cultural experiences.",categories:["Heritage","Food","Culture","Nature"],cost:4200,crowd:"Medium",idealDays:[2,3,5],baseScore:87,image:"image/annie-spratt-slTVVuk7hZU-unsplash.jpg"},
        {name:"Rishikesh Nature & Adventure",state:"Uttarakhand",description:"Nature, river-side experiences and outdoor activities.",categories:["Nature","Adventure"],cost:4000,crowd:"High",idealDays:[2,3,5],baseScore:86,image:"image/rishu-bhosale-URPvbncq-4M-unsplash.jpg"}
    ];

    const destinationInput=document.querySelector(".input-box input");
    const selects=document.querySelectorAll(".input-box select");
    const budgetSelect=selects[0],durationSelect=selects[1];
    const planButton=document.querySelector(".plan-btn");
    const interests=document.querySelectorAll(".interest");
    if(!destinationInput||!planButton||!budgetSelect||!durationSelect)return;

    interests.forEach(button=>button.addEventListener("click",()=>{
        interests.forEach(item=>item.classList.remove("active"));
        button.classList.add("active");
    }));

    const normalize=text=>text.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
    const getInterest=()=>document.querySelector(".interest.active")?.textContent.trim()||"Heritage";
    function getBudget(){const v=budgetSelect.value;if(v.includes("25,000+"))return 50000;if(v.includes("10,000 - 25,000"))return 25000;if(v.includes("5,000 - 10,000"))return 10000;if(v.includes("5,000"))return 5000;return 50000;}
    function getDays(){const v=durationSelect.value;if(v.includes("7+"))return 8;if(v.includes("4-7"))return 5;if(v.includes("3 Day"))return 3;if(v.includes("2 Day"))return 2;if(v.includes("1 Day"))return 1;return 2;}

    function matches(place,query){
        if(!query)return false;
        const q=normalize(query),text=normalize(`${place.name} ${place.state}`);
        return text.includes(q)||q.split(" ").some(word=>word.length>2&&text.includes(word));
    }
    function interestScore(place,interest){return place.categories.some(c=>normalize(c)===normalize(interest))?100:35;}
    function budgetScore(place,budget){if(place.cost<=budget)return 100;return Math.max(0,Math.round(100-((place.cost-budget)/Math.max(budget,1))*100));}
    function crowdScore(place){return place.crowd==="Low"?100:place.crowd==="Medium"?78:55;}
    function durationScore(place,days){const d=Math.min(...place.idealDays.map(x=>Math.abs(x-days)));return Math.max(45,100-d*18);}

    function calculateMatch(place,interest,budget,days){
        const factors={opportunity:place.baseScore,interest:interestScore(place,interest),budget:budgetScore(place,budget),crowd:crowdScore(place),duration:durationScore(place,days)};
        const score=Math.round(factors.opportunity*.10+factors.interest*.30+factors.budget*.25+factors.crowd*.20+factors.duration*.15);
        const reasons=[];
        if(factors.interest>=90)reasons.push(`${interest} match`);
        if(factors.budget>=90)reasons.push("within budget");
        if(factors.crowd>=90)reasons.push("low crowd");
        if(factors.duration>=90)reasons.push("ideal duration");
        if(!reasons.length)reasons.push("balanced overall fit");
        return {...place,score,factors,reasons};
    }

    function getRecommendations(destination,interest,budget,days){
        const exact=destinations.filter(p=>matches(p,destination));
        const source=exact.length?exact:destinations;
        return {results:source.map(p=>calculateMatch(p,interest,budget,days)).sort((a,b)=>b.score-a.score).slice(0,3),exactMatch:exact.length>0};
    }

    function showResults(data,budget,days,interest,destination){
        document.querySelector(".results-section")?.remove();
        const section=document.createElement("section");section.className="results-section";
        const note=data.exactMatch?`Matched to ${destination}`:`No exact match for “${destination}” — showing the best available tourism opportunities.`;
        section.innerHTML=`<div class="results-container">
            <div class="results-heading"><div><span class="eyebrow">AI RECOMMENDATION</span><h2>Your personalized <span>travel opportunities</span></h2><p>${note} Based on ${interest}, ₹${budget.toLocaleString()} budget and ${days} day${days>1?"s":""} trip.</p></div><div class="result-count">${data.results.length} recommendations</div></div>
            <div class="result-grid">${data.results.map((p,i)=>`<article class="result-card"><div class="result-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='image/sukant-sharma-b6rs6V_9lH4-unsplash.jpg';"><div class="result-score"><i class="fa-solid fa-star"></i> ${p.score}</div>${i===0?`<span class="best-match"><i class="fa-solid fa-wand-magic-sparkles"></i> Best Match</span>`:""}</div><div class="result-content"><div class="result-location"><i class="fa-solid fa-location-dot"></i> ${p.state}, India</div><h3>${p.name}</h3><p>${p.description}</p><div class="result-details"><span><i class="fa-solid fa-users"></i> ${p.crowd} Crowd</span><span><i class="fa-solid fa-wallet"></i> ₹${p.cost.toLocaleString()}</span><span><i class="fa-solid fa-calendar"></i> ${days} Day${days>1?"s":""}</span></div><div class="match-reasons">${p.reasons.map(r=>`<span><i class="fa-solid fa-check"></i> ${r}</span>`).join("")}</div><div class="match-info"><div><strong>${p.score>=90?"Excellent Match":p.score>=80?"Great Match":"Good Match"}</strong><small>Smart score from 5 travel factors</small></div><button class="itinerary-btn" data-place="${p.name}">View Trip <i class="fa-solid fa-arrow-right"></i></button></div></div></article>`).join("")}</div>
            <div class="engine-note"><div class="engine-icon"><i class="fa-solid fa-brain"></i></div><div><strong>Why these recommendations?</strong><p>YatraNova combines opportunity potential, interest match, budget fit, crowd suitability and trip duration instead of relying on popularity alone.</p></div></div>
            <div class="score-breakdown"><strong>Smart Match factors</strong><span>Interest 30%</span><span>Budget 25%</span><span>Crowd 20%</span><span>Duration 15%</span><span>Opportunity 10%</span></div></div>`;
        document.querySelector("main").appendChild(section);addResultStyles();section.scrollIntoView({behavior:"smooth"});
        section.querySelectorAll(".itinerary-btn").forEach(b=>b.addEventListener("click",()=>showItinerary(b.dataset.place,days,budget,interest)));
    }

    function showItinerary(placeName,days,budget,interest){
        document.querySelector(".itinerary-modal")?.remove();
        const modal=document.createElement("div");modal.className="itinerary-modal";let html="";
        for(let day=1;day<=Math.min(days,5);day++){
            const focus=day===1?"Arrival & local orientation":day===2?`${interest} highlights`:day===3?"Local experiences & hidden spots":day===4?"Nature / culture exploration":"Flexible discovery day";
            html+=`<div class="day-card"><div class="day-number">Day ${day}</div><div class="day-content"><div><span>09:00 AM</span><strong>${focus}</strong></div><div><span>01:00 PM</span><strong>Local food experience</strong></div><div><span>04:00 PM</span><strong>${interest} experience</strong></div><div><span>07:00 PM</span><strong>Local market / cultural experience</strong></div></div></div>`;
        }
        modal.innerHTML=`<div class="modal-overlay"><div class="itinerary-box"><button class="close-modal"><i class="fa-solid fa-xmark"></i></button><span class="eyebrow">PERSONALIZED ITINERARY</span><h2>${placeName}</h2><p class="modal-subtitle">${days} day journey · Budget ₹${budget.toLocaleString()} · ${interest}</p><div class="itinerary-summary"><div><i class="fa-solid fa-star"></i><span>Smart Match</span></div><div><i class="fa-solid fa-wallet"></i><span>Budget Friendly</span></div><div><i class="fa-solid fa-leaf"></i><span>Local Experience</span></div></div><div class="days-container">${html}</div><button class="close-bottom">Done</button></div></div>`;
        document.body.appendChild(modal);modal.querySelector(".close-modal").addEventListener("click",()=>modal.remove());modal.querySelector(".close-bottom").addEventListener("click",()=>modal.remove());modal.querySelector(".modal-overlay").addEventListener("click",e=>{if(e.target.classList.contains("modal-overlay"))modal.remove();});
    }

    planButton.addEventListener("click",()=>{
        const destination=destinationInput.value.trim(),budget=getBudget(),days=getDays(),interest=getInterest();
        if(!destination){destinationInput.focus();alert("Please enter a destination first.");return;}
        planButton.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Finding...`;planButton.disabled=true;
        setTimeout(()=>{showResults(getRecommendations(destination,interest,budget,days),budget,days,interest,destination);planButton.innerHTML=`<span>Plan My Trip</span><i class="fa-solid fa-arrow-right"></i>`;planButton.disabled=false;},500);
    });

    function addResultStyles(){
        if(document.getElementById("yatra-results-style"))return;
        const style=document.createElement("style");style.id="yatra-results-style";style.textContent=`
            .results-section{padding:80px 20px;background:#f7f8fa}.results-container{max-width:1200px;margin:auto}.results-heading{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:35px}.results-heading h2{margin:8px 0;font-size:clamp(30px,4vw,48px)}.results-heading h2 span{display:block}.results-heading p{max-width:720px;line-height:1.6}.result-count{font-weight:700;white-space:nowrap}.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.result-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08)}.result-image{height:230px;position:relative;background:#ddd;overflow:hidden}.result-image img{width:100%;height:100%;object-fit:cover;display:block}.result-score,.best-match{position:absolute;top:14px;padding:8px 12px;border-radius:999px;background:#fff;font-weight:700}.result-score{right:14px}.best-match{left:14px}.result-content{padding:22px}.result-location{font-size:13px;font-weight:600;opacity:.7}.result-content h3{font-size:23px;margin:10px 0}.result-content>p{line-height:1.6;opacity:.75;min-height:48px}.result-details,.match-reasons{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.result-details span,.match-reasons span{background:#f3f5f7;padding:7px 10px;border-radius:8px;font-size:12px}.match-reasons span{background:#fff6f1}.match-info{display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid #eee;padding-top:16px}.match-info small{display:block;opacity:.6;margin-top:3px;font-size:10px}.itinerary-btn{border:0;border-radius:10px;padding:11px 14px;cursor:pointer;font-weight:700}.engine-note{display:flex;gap:15px;align-items:center;margin-top:30px;padding:20px;background:#fff;border-radius:15px;box-shadow:0 6px 25px rgba(0,0,0,.05)}.engine-icon{min-width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#fff1eb}.engine-note p{margin:5px 0 0;opacity:.7;font-size:12px;line-height:1.5}.score-breakdown{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:16px;font-size:11px}.score-breakdown span{padding:6px 9px;background:#fff;border:1px solid #eee;border-radius:7px}.itinerary-modal{position:fixed;inset:0;z-index:5000}.modal-overlay{width:100%;height:100%;padding:20px;background:rgba(5,18,30,.72);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center}.itinerary-box{position:relative;width:min(760px,100%);max-height:90vh;overflow-y:auto;padding:32px;background:#fff;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.3)}.close-modal{position:absolute;top:18px;right:18px;width:35px;height:35px;border-radius:50%;background:#f3f5f7;border:0;cursor:pointer}.itinerary-box h2{font-size:34px;margin:8px 0}.modal-subtitle{opacity:.7;font-size:12px}.itinerary-summary{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.itinerary-summary div{padding:8px 10px;background:#fff7f3;border-radius:8px;font-size:10px;font-weight:700}.day-card{display:grid;grid-template-columns:80px 1fr;border:1px solid #e5eaf0;border-radius:13px;margin-bottom:12px;overflow:hidden}.day-number{background:#102a43;color:#fff;display:flex;justify-content:center;align-items:center;font-size:12px;font-weight:700}.day-content{padding:14px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.day-content div{display:flex;flex-direction:column}.day-content span{font-size:9px;font-weight:700}.day-content strong{font-size:11px;margin-top:2px}.close-bottom{width:100%;padding:12px;margin-top:10px;border:0;border-radius:9px;background:#102a43;color:#fff;font-weight:700;cursor:pointer}.match-reasons{margin:14px 0 4px}@media(max-width:900px){.result-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.result-grid{grid-template-columns:1fr}.results-heading{display:block}.result-count{margin-top:15px}.day-card{grid-template-columns:1fr}.day-number{padding:9px}.day-content{grid-template-columns:1fr}}
        `;document.head.appendChild(style);
    }

    document.querySelectorAll(".save-btn").forEach(button=>button.addEventListener("click",()=>{const icon=button.querySelector("i");icon?.classList.toggle("fa-regular");icon?.classList.toggle("fa-solid");button.classList.toggle("saved");}));
});