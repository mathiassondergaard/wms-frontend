<script context="module">
    export async function load({ fetch }) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        return {};
    }
</script>

<h1>Welcome to SvelteKit</h1>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
