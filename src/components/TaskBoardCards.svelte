<script>
    export let tasks;
    import {formatDateString} from '$lib/formatDate';

</script>

{#each tasks as task}
    <div class="card bg-base-100 p-2">
        <div tabindex="0" id={task.id} on:click={() => document.getElementById(task.id).scrollIntoView()} class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <div class="collapse-title text-lg font-medium">
                {task.name}
            </div>
            <div class="collapse-content">
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
                    <p>{task.status}</p>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">
                        Priority
                    </h3>
                    <p>{task.level}</p>
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Started at</h3>
                    {#if !task.startedAt}
                        <p>No data</p>
                    {:else }
                        <p>
                            {formatDateString(task.startedAt)}
                        </p>
                    {/if}
                </div>
                <div class="w-2/3">
                    <h3 class="font-bold">Completed at</h3>
                    {#if !task.completedAt}
                        <p>No data</p>
                    {:else }
                        <p>
                            {formatDateString(task.completedAt)}
                        </p>
                    {/if}
                </div>
                <div class="card-actions pt-5 justify-end">
                    <a class="btn btn-ghost btn-sm btn-outline" rel="external" sveltekit:prefetch="" href="/tasks/{task.id}">Details</a>
                    <a class="btn btn-ghost btn-sm btn-outline" rel="external" sveltekit:prefetch="" href="/tasks/{task.id}/edit">Edit Task</a>
                </div>
            </div>
        </div>
    </div>
{/each}
