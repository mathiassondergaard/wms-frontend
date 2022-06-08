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
        if (res.status !== 200) {
            console.error(`${data.message}`);
        }
        return {props: {tasks: data}};
    }
</script>

<script>
    import {onMount} from "svelte";
    import {del} from "$lib/api";
    import {getNotificationsContext} from 'svelte-notifications';
    import {handleResponse} from "$lib/handleResponse";
    import {LightPaginationNav, paginate} from "svelte-paginate";
    import {options} from "$lib/toaster";

    const {addNotification} = getNotificationsContext();

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
        let index = items.indexOf(task);

        const response = await del(`/resources/tasks/${task.id}`);

        const handled = handleResponse(response, addNotification);
        if (handled) {
            addNotification(options(response.data.message, 'success'));
            items.splice(index, 1);
            items = items;
        }
    };

    const showByStatus = (status) => {
        const newItems = [];
        tasks.forEach(item => {
            if (item.status === status) {
                newItems.push(item)
            }
        });
        return items = newItems.sort((a, b) => a.id - b.id);
    };
    const showByLevel = (level) => {
        const newItems = [];
        tasks.forEach(item => {
            if (item.level === level) {
                newItems.push(item)
            }
        });
        return items = newItems.sort((a, b) => a.id - b.id);
    };

    const levelSortOrder = ['LOW', 'MEDIUM', 'HIGH'];
    const statusSortOrder = ['NOT-STARTED', 'ON-GOING', 'COMPLETED', 'POSTPONED'];

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
            <span class="label-text font-bold">Show by: </span>
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
                    <button class="btn-sm" on:click={() => {
                            items = tasks;
                        }}>ALL
                    </button>
                </li>
                {#each statusSortOrder as status}
                    <li>
                        <button class="btn-sm" on:click={() => {
                            showByStatus(status);
                        }}>{status}
                        </button>
                    </li>
                    {/each}
            </ul>
        </div>
        <div class="dropdown">
            <label tabindex="0" class="btn m-1 btn-sm btn-outline">
                Level
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                     viewBox="0 0 24 24">
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <button class="btn-sm" on:click={() => {
                            items = tasks;
                        }}>ALL
                    </button>
                </li>
                {#each levelSortOrder as level}
                    <li>
                        <button class="btn-sm" on:click={() => {
                            showByLevel(level);
                        }}>{level}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="grid w-full">
            <div class="btn-group justify-end pb-5">
                <a class="btn btn-outline" href="/tasks/add" rel="external">Add Task</a>
            </div>
            <div class="overflow-x-auto">
                <table class="table table-zebra">
                    <thead>
                    <tr>
                        <th>
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    ID
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id).reverse() }>
                                            DESCENDING
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th class="justify-items-center">
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Name
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.name.localeCompare(b.name))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.name.localeCompare(b.name)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th>
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Assignee
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.assignee.localeCompare(b.assignee))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.assignee.localeCompare(b.assignee)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th>
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Level
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => levelSortOrder.indexOf(a.level) - levelSortOrder.indexOf(b.level))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => levelSortOrder.indexOf(a.level) - levelSortOrder.indexOf(b.level)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th class="content-center">
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Status
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => statusSortOrder.indexOf(a.status) - statusSortOrder.indexOf(b.status))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => statusSortOrder.indexOf(a.status) - statusSortOrder.indexOf(b.status)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th>
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Started
                                    <br>
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.startedAt.localeCompare(b.startedAt))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.startedAt.localeCompare(b.startedAt)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
                        <th>
                            <div class="dropdown">
                                <label tabindex="0" class="btn m-1 btn-xs btn-ghost">
                                    Completed
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                         viewBox="0 0 24 24">
                                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                                    </svg>
                                </label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.completedAt.localeCompare(b.completedAt))}
                                        >ASCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.completedAt.localeCompare(b.completedAt)).reverse()}
                                        >DESCENDING
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn-sm" on:click={() => items = items.sort((a, b) => a.id - b.id) }>
                                            DEFAULT
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </th>
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
                                {#if !task.startedAt}
                                    No data
                                {:else }
                                        {new Date(task.startedAt).getUTCDay()}/{new Date(task.startedAt).getUTCMonth()}-{new Date(task.startedAt).getUTCFullYear()}
                                        {new Date(task.startedAt).getUTCHours()}:{new Date(task.startedAt).getUTCMinutes()}
                                {/if}
                            </td>
                            <td>
                                {#if !task.completedAt}
                                    No data
                                {:else }
                                    <p>
                                        {new Date(task.completedAt).getUTCDay()}/{new Date(task.completedAt).getUTCMonth()}-{new Date(task.completedAt).getUTCFullYear()}
                                        {new Date(task.completedAt).getUTCHours()}:{new Date(task.completedAt).getUTCMinutes()}
                                    </p>
                                {/if}
                            </td>
                            <td>
                                <a class="btn btn-sm btn-outline btn-ghost" rel="external" sveltekit:prefetch="" href="/tasks/{task.id}" >Details</a>
                                <a class="btn btn-sm btn-outline btn-ghost" rel="external" sveltekit:prefetch="" href="/tasks/{task.id}/edit">Edit</a>
                                <button class="btn btn-sm btn-outline btn-ghost" on:click={handleDelete(task)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
                <div class="btn-group nav pt-5">
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



