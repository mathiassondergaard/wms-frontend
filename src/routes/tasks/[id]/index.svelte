<script context="module">
    export async function load({params, fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        const res = await fetch(`http://localhost:3000/api/resources/tasks/${params.id}`, {credentials: "include"});
        const data = await res.json();
        if (res.status !== 200) {
            console.error(`${data.message}`);
        }
        return {props: {task: data}};
    }
</script>

<script>
    import {del, patch} from "$lib/api";
    import {goto} from "$app/navigation";
    import {getNotificationsContext} from 'svelte-notifications';
    import {handleResponse} from "$lib/handleResponse";
    import {options} from "$lib/toaster";

    const {addNotification} = getNotificationsContext();

    export let task;

    const updateLevel = async (level) => {
        const response = await patch(`/resources/tasks/${task.id}/level/${level}`);
        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            task.level = level;
            task.level = task.level;
        }
    };

    const updateStatus = async (status) => {
        const response = await patch(`/resources/tasks/${task.id}/status/${status}`);
        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            task.status = status;
            task.status = task.status;
        }
    };

    const handleDelete = async () => {
        const response = await del(`/resources/tasks/${task.id}`);
        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            await goto('/tasks');
        }
    };

    const startTask = async () => {
        const response = await patch(`/resources/tasks/${task.id}/start`);
        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            task.startedAt = response.data.date;
            task.status = response.data.status;
            task.startedAt = task.startedAt;
            task.status = task.status;
        }
    };

    const completeTask = async () => {
        const response = await patch(`/resources/tasks/${task.id}/complete`);
        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            task.completedAt = response.data.date;
            task.status = response.data.status;
            task.completedAt = task.completedAt;
            task.status = task.status;
        }
    };

    const status = ['NOT-STARTED', 'ON-GOING', 'COMPLETED', 'POSTPONED'];
    const levels = ['LOW', 'MEDIUM', 'HIGH'];

</script>

<svelte:head>
    <title>{'Tasks - ' + task.name}</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl">Details of: &nbsp;{task.name}</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto flex flex-wrap p-8 rounded-box w-full">
        <div class="card lg:card-side w-2/3 bg-base-100 shadow-xl">

            <div class="card-body">
                <div class="card-actions justify-end pt-5">
                    <a href="/tasks" rel="external" sveltekit:prefetch="" class="btn btn-outline justify-end btn-ghost btn-sm">Return</a>
                </div>
                <h2 class="card-title">{task.name}</h2>
                <br>
                <div class="w-2/3">
                    <h3 class="font-bold">ID</h3>
                    <p>{task.id}</p>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Description</h3>
                    <p>{task.description}</p>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Assigned Employees</h3>
                    <ul>
                        {#each task.assignedEmployees as employee}
                        <li>{employee.name}</li>
                            {/each}
                    </ul>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">
                        Status
                    </h3>
                        <label class="label">
                            <span class="">{task.status}</span>
                        </label>
                        <div class="dropdown">
                            <button tabindex="0" class="btn m-1 btn-xs btn-outline">
                                Update
                                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                     viewBox="0 0 24 24">
                                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                </svg>
                            </button>
                            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                {#each status as status}
                                    {#if task.status !== status}
                                        <li>
                                            <button class="btn-sm" on:click={() => {
                                            updateStatus(status);
                                            }}>{status}
                                            </button>
                                        </li>
                                    {/if}
                                {/each}
                            </ul>
                        </div>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">
                        Priority
                    </h3>
                    <label class="label">
                        <span class="">{task.level}</span>
                    </label>
                    <div class="dropdown">
                        <button tabindex="0" class="btn m-1 btn-xs btn-outline">
                            Update
                            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                 viewBox="0 0 24 24">
                                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                            </svg>
                        </button>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            {#each levels as level}
                                {#if task.level !== level}
                                    <li>
                                        <button class="btn-sm" on:click={() => {
                                            updateLevel(level);
                                            }}>{level}
                                        </button>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Started at</h3>
                    {#if !task.startedAt}
                        <p>No data</p>
                        {:else }
                        <p>
                            {new Date(task.startedAt).getUTCDay()}/{new Date(task.startedAt).getUTCMonth()}-{new Date(task.startedAt).getUTCFullYear()}
                            {new Date(task.startedAt).getUTCHours()}:{new Date(task.startedAt).getUTCMinutes()}
                        </p>
                    {/if}
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Completed at</h3>
                    {#if !task.completedAt}
                        <p>No data</p>
                    {:else }
                        <p>
                            {new Date(task.completedAt).getUTCDay()}/{new Date(task.completedAt).getUTCMonth()}-{new Date(task.completedAt).getUTCFullYear()}
                            {new Date(task.completedAt).getUTCHours()}:{new Date(task.completedAt).getUTCMinutes()}
                        </p>
                    {/if}
                </div>
                <div class="card-actions pt-5 justify-end">
                    {#if !task.startedAt}
                        <button class="btn btn-ghost btn-sm btn-outline" on:click={() => startTask(task)}>Start Task</button>
                    {/if}
                    {#if !task.completedAt}
                        <button class="btn btn-ghost btn-sm btn-outline" on:click={() => completeTask(task)}>Complete Task</button>
                    {/if}
                    <a class="btn btn-ghost btn-sm btn-outline" rel="external" sveltekit:prefetch="" href="/tasks/{task.id}/edit">Edit Task</a>
                    <button class="btn btn-ghost btn-sm btn-outline" on:click={() => handleDelete()}>Delete Task</button>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .dropdown, label{
        display: inline-block;
    }

</style>