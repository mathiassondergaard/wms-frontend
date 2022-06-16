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
    import TaskBoardCards from "../../components/TaskBoardCards.svelte";
    export let tasks;

    const tasksNotStarted = tasks.filter(i => i.status === 'NOT-STARTED');
    const tasksOnGoing = tasks.filter(i => i.status === 'ON-GOING');
    const tasksPostponed = tasks.filter(i => i.status === 'POSTPONED');
    const tasksCompleted = tasks.filter(i => i.status === 'COMPLETED');

</script>

<svelte:head>
    <title>Tasks - Board</title>
</svelte:head>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl">Task Board</h1>
</div>

<section class="pt-5">
    <div class="container mx-auto p-8 rounded-box w-full">
        <div class="grid grid-cols-4 gap-6 w-full">
            <div class="rounded-box shadow-lg">
                <h2 class="pb-5 pt-5 text-xl title-font font-bold">NOT-STARTED</h2>
                <div class="overflow-scroll rounded-box shadow-xl">
                    {#if tasksNotStarted.length === 0}
                        <h2 class="pb-5 pt-5 text-lg title-font font-bold">No data</h2>
                    {:else }
                        <TaskBoardCards tasks={tasksNotStarted} />
                    {/if}
                </div>
            </div>
            <div class="rounded-box shadow-lg">
                <h2 class="pb-5 pt-5 text-xl title-font font-bold">ON-GOING</h2>
                <div class="overflow-auto rounded-box shadow-xl">
                    {#if tasksOnGoing.length === 0}
                        <h2 class="pb-5 pt-5 text-lg title-font font-bold">No data</h2>
                    {:else }
                        <TaskBoardCards tasks={tasksOnGoing} />
                    {/if}
                </div>
            </div>
            <div class="rounded-box shadow-lg">
                <h2 class="pb-5 pt-5 text-xl title-font font-bold">COMPLETED</h2>
                <div class="overflow-auto rounded-box shadow-xl">
                    {#if tasksCompleted.length === 0}
                        <h2 class="pb-5 pt-5 text-lg title-font font-bold">No data</h2>
                    {:else }
                        <TaskBoardCards tasks={tasksCompleted} />
                    {/if}
                </div>
            </div>
            <div class="rounded-box shadow-lg">
                <h2 class="pb-5 pt-5 text-xl title-font font-bold">POSTPONED</h2>
                <div class="overflow-auto rounded-box shadow-xl">
                    {#if tasksPostponed.length === 0}
                        <h2 class="pb-5 pt-5 text-lg title-font font-bold">No data</h2>
                    {:else }
                        <TaskBoardCards tasks={tasksPostponed} />
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    h2 {
        text-align: center;
    }
</style>