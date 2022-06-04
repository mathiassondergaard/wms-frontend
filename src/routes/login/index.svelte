<script context="module">
    export async function load({ fetch }) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status === 200) {
            return {
                status: 302,
                redirect: "/"
            };
        }

        return {};
    }
</script>

<script>
    import {goto} from "$app/navigation";

    let uname = '';
    let pw = '';

    async function submit() {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/sign-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: uname,
                    password: pw
                }),
            });

            uname = null;
            pw = null;

            if (response.status === 401 || 500) {
                if (response.status === 401) {
                    console.log('no auth');
                    return null;
                }
                else if (response.status === 500) {
                    console.log('err');
                    return null;
                }
            }

            await goto('/');
        } catch (err) {
            console.log(err);
        }
    }
</script>

<section>
    <form on:submit|preventDefault={submit}>
        <label for="uname">Username:</label><br>
        <input type="text" id="uname" bind:value={uname}>
        <br>
        <label for="pw">Password:</label><br>
        <input type="password" id="pw" bind:value={pw}>
        <br><br>
        <button type="submit" >Submit</button>
    </form>
</section>