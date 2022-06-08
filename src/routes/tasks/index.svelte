<script context="module">
    export async function load({fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        const res = await fetch('http://localhost:3000/api/resources/tasks', {credentials: "include"});
        const data = await res.json();
        if (res.status === 500) {
            console.error(`${data.message}`);
        } else if (res.status === 404) {
            console.error(`${data.message}`);
        }
        return {props: {tasks: data}};
    }
</script>

<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {del} from "$lib/api";
    import {getNotificationsContext} from 'svelte-notifications';

    const {addNotification} = getNotificationsContext();
    import {options} from "$lib/toaster";
    import {LightPaginationNav, paginate} from "svelte-paginate";

    export let tasks;

    let items = [];

    //Runs after component is rendered to DOM, controls lifecycle of component.
    onMount(async () => {
        items = tasks;
    });

    //Pagination options
    let currentPage = 1;
    let pageSize = 8;
    $: paginatedItems = paginate({items, pageSize, currentPage});

    const handleDelete = async (task) => {
        let index = tasks.indexOf(task);
        const response = await del(`/resources/tasks/${task.id}`);
        if (response.status === 401) {
            addNotification(options(`${response.data.message}`, 'warning'));
            return null;
        } else if (response.status === 500) {
            addNotification(options('Unexpected error occurred, please try again!', 'danger'));
            return null;
        }
        addNotification(options(`Successfully deleted task ${task.id}!`, 'success'));
        tasks.splice(index, 1);
    };

    const levelSortOrder = ['LOW', 'MEDIUM', 'HIGH']

    const sortByStatus = (status) => {
        const newItems = [];
        tasks.forEach(item => {
            if (item.status === status) {
                newItems.push(item)
            }
        });
        return items = newItems;
    };

</script>

<svelte:head>
    <title>Tasks</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl">Tasks</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto flex flex-wrap p-8 rounded-box w-full">
        <label class="label">
            <span class="label-text font-bold">Sort by Task status</span>
        </label>
        <div class="dropdown">
            <label tabindex="0" class="btn m-1 btn-sm btn-outline">
                Status
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                     viewBox="0 0 24 24">
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <button on:click={() => {
                            items = tasks;
                        }}>ALL
                    </button>
                </li>
                <li>
                    <button on:click={() => {
                            sortByStatus('NOT-STARTED');
                        }}>NOT-STARTED
                    </button>
                </li>
                <li>
                    <button on:click={() => {
                            sortByStatus('ON-GOING');
                        }}>ON-GOING
                    </button>
                </li>
                <li>
                    <button on:click={() => {
                            sortByStatus('COMPLETED');
                        }}>COMPLETED
                    </button>
                </li>
                <li>
                    <button on:click={() => {
                            sortByStatus('POSTPONED');
                        }}>POSTPONED
                    </button>
                </li>
            </ul>
        </div>
        <div class="grid w-full">
            <div class="btn-group justify-end pb-5">
                <button class="btn btn-outline">Add Task</button>
            </div>
            <div class="overflow-x-auto">
                <table class="table table-zebra">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Assignee</th>
                        <th>
                            <!-- TODO: MAKE MULTI CLICK BUTTON, THAT REVERSES SORT, THEN DEFAULT, THEN BACK TO FIRST OPTION -->
                            <button on:click={() => items = items.sort((a, b) => levelSortOrder.indexOf(a.level) - levelSortOrder.indexOf(b.level))}
                                    class="btn btn-sm btn-ghost">
                                Level
                                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                     viewBox="0 0 24 24">
                                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                </svg>
                            </button>
                        </th>
                        <th>Status</th>
                        <th>Assigned Employees</th>
                        <th>Started At</th>
                        <th>Completed At</th>
                        <th>Util</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each paginatedItems as task}
                        <tr>
                            <td>{task.id}</td>
                            <td>{task.name}</td>
                            <td>{task.assignee}</td>
                            {#if task.level === 'MEDIUM'}
                                <td style="background: yellow">{task.level}</td>
                            {:else if task.level === 'HIGH'}
                                <td style="background: red">{task.level}</td>
                            {:else}
                                <td style="background: lawngreen">{task.level}</td>
                            {/if}

                            <td>
                                {task.status}
                            </td>
                            <td>
                                {#each task.assignedEmployees as employee, i}
                                    {#if i + 1 === task.assignedEmployees.length}
                                        {employee.name}
                                    {:else }
                                        {employee.name}, &nbsp;
                                    {/if}
                                {/each}
                            </td>
                            <td>
                                {#if !task.startedAt}
                                    No data
                                {:else }
                                    {task.startedAt}
                                {/if}
                            </td>
                            <td>
                                {#if !task.completedAt}
                                    No data
                                {:else }
                                    {task.completedAt}
                                {/if}
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline btn-info"
                                        on:click={async () => {await goto(`/tasks/${task.id}`)}}>Details
                                </button>
                                <button class="btn btn-sm btn-outline btn-accent"
                                        on:click={async () => {await goto(`/tasks/${task.id}/edit`)}}>Edit
                                </button>
                                <button class="btn btn-sm btn-outline btn-warning" on:click={handleDelete(task)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
                <div class="btn-group nav pt-2">
                    <LightPaginationNav
                            totalItems="{items.length}"
                            pageSize="{pageSize}"
                            currentPage="{currentPage}"
                            limit="{1}"
                            showStepOptions="{true}"
                            on:setPage="{(p) => currentPage = p.detail.page}"
                    />
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    table, th, td {
        border: 1px solid;
    }
</style>

