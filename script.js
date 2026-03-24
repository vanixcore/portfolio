/*global supabase*/
const supabaseUrl = 'https://sggfrwruezxdakvzwynr.supabase.co';
const supabaseKey = 'sb_publishable_Dor8s13toQMbbOk0VGWnJw_c01DyfeY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
 async function checkSystemStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('db-status');

    try {
        const { data, error } = await _supabase.from('projects').select('count', { count: 'exact', head: true });
        if (!error) {
            statusDot.classList.add('online');
            statusText.innerText = 'ONLINE';
            statusText.style.color = '#00ff41';
        }
    } catch (e) {
        statusText.innerText = 'OFFLINE';
    }
}

checkSystemStatus();
async function loadProjects() {
    const grid = document.querySelector('.grid');
    if (!grid) return;

    console.log("> INITIALIZING_PROJECT_FETCH...");

    const { data: projects, error } = await _supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("> ERROR: PROJECT_LOAD_FAILED", error.message);
        grid.innerHTML = '<p style="color: #ff3e3e">> ERROR: OFFLINE_MODE_ACTIVE</p>';
        return;
    }

    grid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = `card ${project.is_stealth ? 'stealth' : ''}`;
        
        card.innerHTML = `
            <div class="card-header">
                <span class="tag">${project.is_stealth ? 'PROJECT_ALPHA' : 'ENGINE'}</span>
                <span class="tech">${project.tech_stack ? project.tech_stack.join(' // ') : 'VANILLA_JS'}</span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            
            ${project.is_stealth ? `
                <div class="progress-container">
                    <div class="progress-bar" style="width: 75%"></div>
                </div>
                <p class="status-msg">> INITIALIZING_CORE_NODES...</p>
            ` : ''}

            <div class="card-links">
                ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="btn-link">EXECUTE_DEMO →</a>` : ''}
                ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="btn-link secondary">SOURCE_CODE</a>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });

    console.log("> SYSTEMS_READY: PROJECTS_RENDERED");
    initCodifyHover();
}
const waitlistForm = document.querySelector('#waitlist-form');
const statusDisplay = document.querySelector('.waitlist-section p');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = waitlistForm.querySelector('input[type="email"]');
        const submitBtn = waitlistForm.querySelector('button');
        const emailValue = emailInput.value.trim();
        submitBtn.innerText = "CONNECTING...";
        submitBtn.disabled = true;
        statusDisplay.innerText = "> ATTEMPTING_HANDSHAKE...";

        try {
            const entry = { 
                email: emailValue, 
                source: 'portfolio_v1' 
            };

            const { error } = await _supabase
                .from('waitlist')
                .insert([entry]); 
       
            console.log("> SIGNAL_SENT");
            statusDisplay.innerHTML = `<span style="color: #00ff41">> SIGNAL_RECEIVED.</span>`;
           
            document.querySelector('.waitlist-section').classList.add('success-pulse');
            waitlistForm.style.opacity = "0.3";
            waitlistForm.style.pointerEvents = "none";
            submitBtn.innerText = "KEY_STORED";

        } catch (err) {
            console.error("> CRITICAL_FAULT:", err);
            statusDisplay.innerText = "> ERROR: SYSTEM_OFFLINE";
            submitBtn.disabled = false;
            submitBtn.innerText = "STRIKE_KEY";
        }
    });
}

function runSystemLog() {
    const logLines = document.querySelectorAll('.log-box p');
    logLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
            line.style.transition = 'all 0.4s ease';
        }, 200 * index); 
    });
}

function initCodifyHover() {
    const codifyCard = document.querySelector('.stealth');
    const progressBar = document.querySelector('.stealth .progress-bar');

    if (codifyCard && progressBar) {
        codifyCard.addEventListener('mouseenter', () => {
            progressBar.style.width = '98%'; 
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
        });
        
        codifyCard.addEventListener('mouseleave', () => {
            progressBar.style.width = '75%';
            progressBar.style.transition = 'width 0.5s ease';
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    runSystemLog();
});
