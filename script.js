document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'Pranamv';

    // Dynamic GitHub data fetcher
    async function fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            if (!response.ok) return;

            const data = await response.json();

            // Populate live GitHub details onto HUD (but NOT the avatar to avoid CORS taint)
            // Keep local avatar: assets/images/profile.jpg
            if (data.public_repos !== undefined) {
                document.getElementById('gh-repos').textContent = data.public_repos;
            }
            if (data.followers !== undefined) {
                document.getElementById('gh-followers').textContent = data.followers;
            }
        } catch (err) {
            console.log('Using default local stats fallback:', err);
        }
    }

    fetchGitHubStats();
});