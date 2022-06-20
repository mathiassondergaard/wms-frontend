<script context="module">
    export async function load({fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        const res = await fetch('http://localhost:3000/api/resources/employees/property/names', {credentials: "include"});
        const data = await res.json();
        if (res.status !== 200) {
            console.error(`${data.message}`);
        }
        return {props: {employees: data}};
    }
</script>

<script>
    import {post} from "$lib/api";
    import {goto} from "$app/navigation";
    import {getNotificationsContext} from 'svelte-notifications';
    import {handleResponse} from "$lib/handleResponse";
    import {options} from "$lib/toaster";

    export let employees;

    const {addNotification} = getNotificationsContext();

    const task = {
        name: '',
        description: '',
        level: '',
        assignedEmployees: []
    };

    const submit = async (task) => {
        const response = await post('/resources/tasks', task);

        const handled = handleResponse(response, addNotification);

        if (handled) {
            addNotification(options('Successfully added task, redirecting to task overview!', 'success'));
            await new Promise(r => setTimeout(r, 2000));

            await goto('/tasks');
        }

    };

    const status = ['NOT-STARTED', 'ON-GOING', 'COMPLETED', 'POSTPONED'];
    const levels = ['LOW', 'MEDIUM', 'HIGH'];

</script>

<svelte:head>
    <title>{'Tasks - Add'}</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl">Add Task</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto flex flex-wrap p-8 rounded-box w-full">
        <div class="card lg:card-side w-2/3 bg-base-100 shadow-xl">

            <div class="card-body">
                <div class="card-actions justify-end pt-5">
                    <a href="/tasks" rel="external" sveltekit:prefetch="" class="btn btn-outline justify-end btn-ghost btn-sm">Return</a>
                </div>
                <form on:submit|preventDefault={submit(task)}>
                    <div class="grid grid-cols-2 gap-3 w-full">
                        <div>
                            <div class="pt-5">
                                <h3 class="font-bold">Name</h3>
                                <input bind:value={task.name} type="text" placeholder="Order X of Item" class="input input-sm input-bordered max-w-sm" />
                            </div>
                            <div class="pt-5">
                                <h3 class="font-bold">Description</h3>
                                <textarea bind:value={task.description} class="textarea w-full textarea-bordered h-48" maxlength="250" placeholder="A brief description of what to do/solve"></textarea>
                                <label class="label">
                                    <span class="label-text-alt">Characters remaining: {250 - task.description.length}</span>
                                </label>
                            </div>
                            <div class="pt-5 h-48 w-full overflow-auto">
                                <h3 class="font-bold">Assigned Employees</h3>
                                <label class="label">
                                    <span class="label-text">Use CTRL/CMD to select multiple</span>
                                </label>
                                <select class="select select-sm select-bordered w-2/4 h-2/4" multiple bind:value={task.assignedEmployees}>
                                    {#each employees as employee}
                                        <option value={employee.id}>
                                            {employee.name}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div class="pt-5">
                                <h3 class="font-bold">
                                    Priority
                                </h3>
                                <select bind:value={task.level} class="select select-sm select-bordered max-w-sm">
                                    <option disabled selected>Pick a priority</option>
                                    {#each levels as level}
                                        <option value={level}>{level}</option>
                                    {/each}
                                </select>
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
