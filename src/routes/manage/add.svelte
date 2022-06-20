<script context="module">
    export async function load({fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/admin/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }
        return {};
    }
</script>

<script>
    import {post} from "$lib/api";
    import {goto} from "$app/navigation";
    import {getNotificationsContext} from 'svelte-notifications';
    import {handleResponse} from "$lib/handleResponse";
    import {options} from "$lib/toaster";

    const {addNotification} = getNotificationsContext();

    const employee = {
        name: '',
        email: '',
        phone: '',
        title: '',
        address: {
            street: '',
            city: '',
            zip: '',
            country: ''
        },
    };

    const submit = async (employee) => {
        const response = await post('/resources/employees', employee);

        const handled = handleResponse(response, addNotification);

        if (handled) {
            addNotification(options('Successfully added Employee, redirecting to management menu!', 'success'));
            await new Promise(r => setTimeout(r, 2000));

            await goto('/manage');
        }
    };

    const titles = ['Worker', 'Supervisor', 'Manager'];

</script>

<svelte:head>
    <title>{'Manage - Add Emp.'}</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl">Add Employee</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto flex flex-wrap p-8 rounded-box w-full">
        <div class="card lg:card-side w-2/3 bg-base-100 shadow-xl">

            <div class="card-body">
                <div class="card-actions justify-end pt-5">
                    <a href="/manage" rel="external" sveltekit:prefetch="" class="btn btn-outline justify-end btn-ghost btn-sm">Return</a>
                </div>
                <form on:submit|preventDefault={submit(employee)}>
                    <div class="grid grid-cols-3 gap-3 w-full">
                        <div>
                            <h2 class="text-lg font-bold">Personal info</h2>
                            <div class="pt-5">
                                <h3 class="font-bold">Name</h3>
                                <input bind:value={employee.name} type="text" placeholder="Name" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">Email</h3>
                                <input bind:value={employee.email} type="text" placeholder="test@example.dk" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">Phone Number</h3>
                                <input bind:value={employee.phone} type="text" placeholder="10203040" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">
                                    Title
                                </h3>
                                <select bind:value={employee.title} class="select select-sm select-bordered max-w-xs">
                                    <option disabled selected>Pick a title</option>
                                    {#each titles as title}
                                        <option value={title}>{title}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold">Address</h2>
                            <div class="pt-5">
                                <h3 class="font-bold">Country</h3>
                                <input bind:value={employee.address.country} type="text" placeholder="Denmark" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">Street</h3>
                                <input bind:value={employee.address.street} type="text" placeholder="123 Street" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">City</h3>
                                <input bind:value={employee.address.city} type="text" placeholder="Frederiksberg" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">Zip Code</h3>
                                <input bind:value={employee.address.zip} type="text" placeholder="2000" class="input input-sm input-bordered max-w-sm" />
                            </div>

                        </div>
                    </div>
                    <div class="card-actions pt-5 justify-end">
                        <button class="btn btn-ghost btn-sm btn-outline" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
