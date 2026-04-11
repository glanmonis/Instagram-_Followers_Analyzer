document.addEventListener('DOMContentLoaded', function () {

    // Elements
    const followersDrop = document.getElementById('followers-drop');
    const followingDrop = document.getElementById('following-drop');
    const followersFile = document.getElementById('followers-file');
    const followingFile = document.getElementById('following-file');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnLoader = document.getElementById('btn-loader');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnArrow = analyzeBtn.querySelector('.btn-arrow');
    const results = document.getElementById('results');
    const search = document.getElementById('search');
    const sortBtn = document.getElementById('sort-btn');
    const filterBtn = document.getElementById('filter-btn');

    let followersData = null;
    let followingData = null;
    let currentNotFollowingBack = [];
    let currentNotFollowedBack = [];

    // ============================
    // DRAG & DROP
    // ============================

    [followersDrop, followingDrop].forEach(dropArea => {
        dropArea.addEventListener('dragover', e => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });
        dropArea.addEventListener('drop', e => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileSelect(dropArea, files[0]);
        });
    });

    followersFile.addEventListener('change', e => handleFileSelect(followersDrop, e.target.files[0]));
    followingFile.addEventListener('change', e => handleFileSelect(followingDrop, e.target.files[0]));

    // ============================
    // FILE HANDLING
    // ============================

    function handleFileSelect(dropArea, file) {
        if (!file || file.type !== 'application/json') {
            showToast('Please select a valid JSON file.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                const isFollowers = dropArea.id === 'followers-drop';

                if (isFollowers) {
                    followersData = data;
                    updateCardState(dropArea, 'followers-label', 'followers-status', file.name);
                } else {
                    followingData = data;
                    updateCardState(dropArea, 'following-label', 'following-status', file.name);
                }

                checkReadyState();
            } catch {
                showToast('Could not parse JSON file. Please check the file is valid.', 'error');
            }
        };
        reader.readAsText(file);
    }

    function updateCardState(card, labelId, statusId, filename) {
        card.classList.add('loaded');
        document.getElementById(labelId).textContent = filename;
        const statusEl = document.getElementById(statusId);
        statusEl.querySelector('.status-text').textContent = 'File loaded ✓';
    }

    function checkReadyState() {
        analyzeBtn.disabled = !(followersData && followingData);
    }

    // ============================
    // ANALYZE
    // ============================

    analyzeBtn.addEventListener('click', async () => {
        setLoading(true);

        const formData = new FormData();
        const followersBlob = new Blob([JSON.stringify(followersData)], { type: 'application/json' });
        const followingBlob = new Blob([JSON.stringify(followingData)], { type: 'application/json' });
        formData.append('followers', followersBlob, 'followers.json');
        formData.append('following', followingBlob, 'following.json');

        try {
            const response = await fetch('/analyze', { method: 'POST', body: formData });
            const data = await response.json();

            if (response.ok) {
                displayResults(data);
                results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showToast(data.error || 'Analysis failed.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        analyzeBtn.disabled = loading;
        btnLoader.hidden = !loading;
        btnText.style.opacity = loading ? '0.5' : '1';
        btnArrow.style.opacity = loading ? '0' : '1';
    }

    // ============================
    // DISPLAY RESULTS
    // ============================

    function displayResults(data) {
        animateCounter('total-following', data.total_following);
        animateCounter('total-followers', data.total_followers);
        animateCounter('mutual-followers', data.mutual_followers);
        animateCounter('not-following-back-count', data.total_not_following_back);
        animateCounter('not-followed-back-count', data.total_not_followed_back);

        currentNotFollowingBack = data.not_following_back;
        currentNotFollowedBack = data.not_followed_back;

        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);

        results.style.display = 'block';
        results.style.animation = 'fadeUp 0.6s ease both';
    }

    function animateCounter(id, target) {
        const el = document.getElementById(id);
        const duration = 800;
        const start = performance.now();
        function update(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(p * target);
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    function renderList(listId, badgeId, items) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        document.getElementById(badgeId).textContent = items.length;

        if (items.length === 0) {
            const li = document.createElement('li');
            li.style.cssText = 'padding: 32px 24px; color: var(--text-3); font-size: 14px; justify-content: center;';
            li.textContent = 'No accounts found.';
            list.appendChild(li);
            return;
        }

        items.forEach((item, i) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${Math.min(i * 0.03, 0.5)}s`;
            li.innerHTML = `
                <span>@${item}</span>
                <button onclick="window.open('https://instagram.com/${encodeURIComponent(item)}', '_blank')">View ↗</button>
            `;
            list.appendChild(li);
        });
    }

    // ============================
    // SEARCH & SORT
    // ============================

    search.addEventListener('input', applyFilter);

    function applyFilter() {
        const q = search.value.toLowerCase().trim();
        const filteredNFB = currentNotFollowingBack.filter(n => n.toLowerCase().includes(q));
        const filteredNFB2 = currentNotFollowedBack.filter(n => n.toLowerCase().includes(q));
        renderList('not-following-back-list', 'nfb-badge', filteredNFB);
        renderList('not-followed-back-list', 'nfb2-badge', filteredNFB2);
    }

    sortBtn.addEventListener('click', () => {
        currentNotFollowingBack = [...currentNotFollowingBack].sort();
        currentNotFollowedBack = [...currentNotFollowedBack].sort();
        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);
    });

    filterBtn.addEventListener('click', () => {
        currentNotFollowingBack = [...currentNotFollowingBack].sort().reverse();
        currentNotFollowedBack = [...currentNotFollowedBack].sort().reverse();
        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);
    });

    // ============================
    // TOAST NOTIFICATION
    // ============================

    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
            padding: 14px 24px; background: ${type === 'error' ? '#3a1a1a' : '#1a2a1a'};
            color: ${type === 'error' ? '#f08080' : '#80e0a8'};
            border: 1px solid ${type === 'error' ? 'rgba(240,128,128,0.3)' : 'rgba(128,224,168,0.3)'};
            border-radius: 10px; font-size: 14px; font-family: var(--font-body);
            z-index: 999; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            animation: fadeUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

}); document.addEventListener('DOMContentLoaded', function () {

    // Elements
    const followersDrop = document.getElementById('followers-drop');
    const followingDrop = document.getElementById('following-drop');
    const followersFile = document.getElementById('followers-file');
    const followingFile = document.getElementById('following-file');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnLoader = document.getElementById('btn-loader');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnArrow = analyzeBtn.querySelector('.btn-arrow');
    const results = document.getElementById('results');
    const search = document.getElementById('search');
    const sortBtn = document.getElementById('sort-btn');
    const filterBtn = document.getElementById('filter-btn');

    let followersData = null;
    let followingData = null;
    let currentNotFollowingBack = [];
    let currentNotFollowedBack = [];

    // ============================
    // DRAG & DROP
    // ============================

    [followersDrop, followingDrop].forEach(dropArea => {
        dropArea.addEventListener('dragover', e => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });
        dropArea.addEventListener('drop', e => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileSelect(dropArea, files[0]);
        });
    });

    followersFile.addEventListener('change', e => handleFileSelect(followersDrop, e.target.files[0]));
    followingFile.addEventListener('change', e => handleFileSelect(followingDrop, e.target.files[0]));

    // ============================
    // FILE HANDLING
    // ============================

    function handleFileSelect(dropArea, file) {
        if (!file || file.type !== 'application/json') {
            showToast('Please select a valid JSON file.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                const isFollowers = dropArea.id === 'followers-drop';

                if (isFollowers) {
                    followersData = data;
                    updateCardState(dropArea, 'followers-label', 'followers-status', file.name);
                } else {
                    followingData = data;
                    updateCardState(dropArea, 'following-label', 'following-status', file.name);
                }

                checkReadyState();
            } catch {
                showToast('Could not parse JSON file. Please check the file is valid.', 'error');
            }
        };
        reader.readAsText(file);
    }

    function updateCardState(card, labelId, statusId, filename) {
        card.classList.add('loaded');
        document.getElementById(labelId).textContent = filename;
        const statusEl = document.getElementById(statusId);
        statusEl.querySelector('.status-text').textContent = 'File loaded ✓';
    }

    function checkReadyState() {
        analyzeBtn.disabled = !(followersData && followingData);
    }

    // ============================
    // ANALYZE
    // ============================

    analyzeBtn.addEventListener('click', async () => {
        setLoading(true);

        const formData = new FormData();
        const followersBlob = new Blob([JSON.stringify(followersData)], { type: 'application/json' });
        const followingBlob = new Blob([JSON.stringify(followingData)], { type: 'application/json' });
        formData.append('followers', followersBlob, 'followers.json');
        formData.append('following', followingBlob, 'following.json');

        try {
            const response = await fetch('/analyze', { method: 'POST', body: formData });
            const data = await response.json();

            if (response.ok) {
                displayResults(data);
                results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showToast(data.error || 'Analysis failed.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        analyzeBtn.disabled = loading;
        btnLoader.hidden = !loading;
        btnText.style.opacity = loading ? '0.5' : '1';
        btnArrow.style.opacity = loading ? '0' : '1';
    }

    // ============================
    // DISPLAY RESULTS
    // ============================

    function displayResults(data) {
        animateCounter('total-following', data.total_following);
        animateCounter('total-followers', data.total_followers);
        animateCounter('mutual-followers', data.mutual_followers);
        animateCounter('not-following-back-count', data.total_not_following_back);
        animateCounter('not-followed-back-count', data.total_not_followed_back);

        currentNotFollowingBack = data.not_following_back;
        currentNotFollowedBack = data.not_followed_back;

        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);

        results.style.display = 'block';
        results.style.animation = 'fadeUp 0.6s ease both';
    }

    function animateCounter(id, target) {
        const el = document.getElementById(id);
        const duration = 800;
        const start = performance.now();
        function update(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(p * target);
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    function renderList(listId, badgeId, items) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        document.getElementById(badgeId).textContent = items.length;

        if (items.length === 0) {
            const li = document.createElement('li');
            li.style.cssText = 'padding: 32px 24px; color: var(--text-3); font-size: 14px; justify-content: center;';
            li.textContent = 'No accounts found.';
            list.appendChild(li);
            return;
        }

        items.forEach((item, i) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${Math.min(i * 0.03, 0.5)}s`;
            li.innerHTML = `
                <span>@${item}</span>
                <button onclick="window.open('https://instagram.com/${encodeURIComponent(item)}', '_blank')">View ↗</button>
            `;
            list.appendChild(li);
        });
    }

    // ============================
    // SEARCH & SORT
    // ============================

    search.addEventListener('input', applyFilter);

    function applyFilter() {
        const q = search.value.toLowerCase().trim();
        const filteredNFB = currentNotFollowingBack.filter(n => n.toLowerCase().includes(q));
        const filteredNFB2 = currentNotFollowedBack.filter(n => n.toLowerCase().includes(q));
        renderList('not-following-back-list', 'nfb-badge', filteredNFB);
        renderList('not-followed-back-list', 'nfb2-badge', filteredNFB2);
    }

    sortBtn.addEventListener('click', () => {
        currentNotFollowingBack = [...currentNotFollowingBack].sort();
        currentNotFollowedBack = [...currentNotFollowedBack].sort();
        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);
    });

    filterBtn.addEventListener('click', () => {
        currentNotFollowingBack = [...currentNotFollowingBack].sort().reverse();
        currentNotFollowedBack = [...currentNotFollowedBack].sort().reverse();
        renderList('not-following-back-list', 'nfb-badge', currentNotFollowingBack);
        renderList('not-followed-back-list', 'nfb2-badge', currentNotFollowedBack);
    });

    // ============================
    // TOAST NOTIFICATION
    // ============================

    function showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
            padding: 14px 24px; background: ${type === 'error' ? '#3a1a1a' : '#1a2a1a'};
            color: ${type === 'error' ? '#f08080' : '#80e0a8'};
            border: 1px solid ${type === 'error' ? 'rgba(240,128,128,0.3)' : 'rgba(128,224,168,0.3)'};
            border-radius: 10px; font-size: 14px; font-family: var(--font-body);
            z-index: 999; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            animation: fadeUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

});