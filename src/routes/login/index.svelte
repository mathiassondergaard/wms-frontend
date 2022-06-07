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
    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();
    import {options} from "$lib/toaster";

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
                    const data = await response.json();
                    console.log(data)
                    addNotification(options(`${data.message}`, 'warning'))
                    return null;
                }
                else if (response.status === 500) {
                    addNotification(options('Unexpected error occurred.. please try again!', 'danger'))
                    return null;
                }
            }

            await goto('/');
        } catch (err) {
            console.log(err);
        }
    }
</script>

<div class="hero min-h-screen bg-base-100">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <div class="card rounded-box card-bordered border-gray-300 shadow-xl w-96">
                <div class="pt-5">
                    <h1 class="font-bold text-lg">WMS LOGIN</h1>
                </div>
                <div class="p-5">
                    <form on:submit|preventDefault={submit}>
                        <label class="label justify-start pl-20">
                            <span class="label-text font-bold">Username</span>
                        </label>
                        <input placeholder="Username" bind:value={uname} class="input input-bordered max-w-xs"
                               type="text">
                        <label class="label justify-start pl-20">
                            <span class="label-text font-bold">Password</span>
                        </label>
                        <input placeholder="Password" bind:value={pw} class="input input-bordered max-w-xs"
                               type="password">
                        <br>
                        <br>
                        <button class="btn-success btn" type="submit" >Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>