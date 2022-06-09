<script context="module">
    export async function load({params, fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        const empRes = await fetch('http://localhost:3000/api/resources/employees/property/names', {credentials: "include"});
        const empData = await empRes.json();
        if (empRes.status !== 200) {
            console.error(`${empData.message}`);
        }

        const taskRes = await fetch(`http://localhost:3000/api/resources/tasks/${params.id}`, {credentials: "include"});
        const taskData = await taskRes.json();
        if (taskRes.status !== 200) {
            console.error(`${taskData.message}`);
        }

        return {props: {employees: empData, task: taskData}};
    }
</script>

<script>
    import {put} from "$lib/api";
    import {goto} from "$app/navigation";
    import {getNotificationsContext} from 'svelte-notifications';
    import {handleResponse} from "$lib/handleResponse";
    import {options} from "$lib/toaster";

    export let employees;
    export let task;

    const {addNotification} = getNotificationsContext();

    const taskToUpdate = {
        name: '',
        description: '',
        level: '',
        status: '',
        startedAt: Date,
        completedAt: Date,
        assignedEmployees: []
    };

    const submit = async (taskToUpdate) => {
        const response = await put(`/resources/tasks/${task.id}`, taskToUpdate);

        const handled = handleResponse(response, addNotification);

        if (handled) {
            addNotification(options('Successfully updated task!. Redirecting to task overview!', 'success'));
            await new Promise(r => setTimeout(r, 2000));

            await goto('/tasks');
        }

    };

    const status = ['NOT-STARTED', 'ON-GOING', 'COMPLETED', 'POSTPONED'];
    const levels = ['LOW', 'MEDIUM', 'HIGH'];

</script>

<svelte:head>
    <title>{'Tasks - Edit'}</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl">Editing Task {task.id}</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto flex flex-wrap p-8 rounded-box w-full">
        <div class="card lg:card-side w-2/3 bg-base-100 shadow-xl">

            <div class="card-body">
                <div class="card-actions justify-end pt-5">
                    <a href="/tasks" rel="external" sveltekit:prefetch="" class="btn btn-outline justify-end btn-ghost btn-sm">Return</a>
                </div>
                <form on:submit|preventDefault={submit(task)}>
                    <div class="w-2/3">
                        <h3 class="font-bold">Name</h3>
                        <input bind:value={task.name} type="text" placeholder="{task.name}" class="input input-sm input-bordered w-2/3 max-w-xs" />
                    </div>
                    <br/>
                    <div class="w-2/3">
                        <h3 class="font-bold">Description</h3>
                        <textarea bind:value={task.description} class="textarea textarea-bordered h-24 w-2/3" maxlength="250" placeholder="{task.description}"></textarea>
                        <label class="label">
                            <span class="label-text-alt">Characters remaining: {250 - task.description.length}</span>
                        </label>
                    </div>
                    <br/>
                    <div class="w-2/3 max-h-40 overflow-auto">
                        <h3 class="font-bold">Assigned Employees</h3>
                        <label class="label">
                            <span class="label-text">Use Control(Windows) or CMD (mac) to select multiple</span>
                        </label>
                        <select class="select select-bordered w-2/4 h-2/4" multiple bind:value={task.assignedEmployees}>
                            {#each employees as employee}
                                <option value={employee.id}>
                                    {employee.name}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <br/>
                    <div class="w-2/3">
                        <h3 class="font-bold">
                            Status
                        </h3>
                        <select bind:value={task.status} class="select select-sm select-bordered w-full max-w-xs">
                            <option disabled selected>Pick a status, previous: {task.status}</option>
                            {#each status as status}
                                <option value={status}>{status}</option>
                            {/each}
                        </select>
                    </div>
                    <br/>
                    <div class="w-2/3">
                        <h3 class="font-bold">
                            Priority
                        </h3>
                        <select bind:value={task.level} class="select select-sm select-bordered w-full max-w-xs">
                            <option disabled selected>Pick a priority, previous: {task.level}</option>
                            {#each levels as level}
                                <option value={level}>{level}</option>
                            {/each}
                        </select>
                    </div>
                    <br/>
                    <div class="w-2/3">
                        <h3 class="font-bold">Started At</h3>
                        <input bind:value={task.startedAt} type="datetime-local" placeholder="{task.startedAt}" class="input input-sm input-bordered w-2/3 max-w-xs" />
                    </div>
                    <br/>
                    <div class="w-2/3">
                        <h3 class="font-bold">Completed At</h3>
                        <input bind:value={task.completedAt} type="datetime-local" placeholder="{task.completedAt}" class="input input-sm input-bordered w-2/3 max-w-xs" />
                    </div>
                    <div class="card-actions pt-5 justify-end">
                        <button class="btn btn-ghost btn-sm btn-outline" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
