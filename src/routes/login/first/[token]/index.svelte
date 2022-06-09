<script context="module">
    export async function load({page}) {
        return {props: {token: page.params.token}};
    }

</script>

<script>
    import {goto} from "$app/navigation";
    import { getNotificationsContext } from 'svelte-notifications';
    import {options} from '$lib/toaster'
    import {handleResponse} from "$lib/handleResponse";
    import {post} from '$lib/authApi';
    const { addNotification } = getNotificationsContext();

    export let token;

    let pw;
    let confirmPw;

    const submit = async (password) => {
        if (pw !== confirmPw) {
            addNotification(options('Passwords do not match!', 'warning'));
        }
        const response = await post('/users/first-login', `${password}:${token}`);

        const handled = handleResponse(response, addNotification);

        if (handled) {
            addNotification(options('Successfully updated your password. Redirecting to login!', 'success'));
            await new Promise(r => setTimeout(r, 3000));

            await goto('/login');
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
                    <form on:submit|preventDefault={submit(pw)}>
                        <label class="label justify-start pl-20">
                            <span class="label-text font-bold">Password</span>
                        </label>
                        <input placeholder="Password" bind:value={pw} class="input input-bordered max-w-xs"
                               type="password">
                        <label class="label justify-start pl-20">
                            <span class="label-text font-bold">Confirm Password</span>
                        </label>
                        <input placeholder="Retype password" bind:value={confirmPw} class="input input-bordered max-w-xs"
                               type="password">
                        <br>
                        <br>
                        <button class="btn-success btn" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>