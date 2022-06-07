<script context="module">
    export async function load({fetch}) {
        const response = await fetch('http://localhost:3000/api/auth/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        const res = await fetch('http://localhost:3000/api/resources/tasks/employee/internal', {credentials: "include"});
        const data = await res.json();
        if (res.status === 500) {
            console.error(`${data.message}`);
        }
        else if (res.status === 404) {
            console.error(`${data.message}`);
        }
        return {props: {tasks: data}};
    }
</script>

<script>
    export let tasks;
</script>

<div class="flex mx-auto justify-start pl-20 pt-20">
    <h1 class=" title-font font-bold text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl">Your Dashboard</h1>
</div>

<section class="pt-24">
    <div class="container mx-auto flex flex-row flex-wrap p-8 rounded-box w-full">
        <div class="grid grid-cols-5 gap-3 w-full">
            <div class="col-span-3">

                <div class="overflow-x-auto">
                    <table class="table table-zebra">
                        <!-- head -->
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Assignee</th>
                            <th>Level</th>
                            <th>Status</th>
                            <th>Util</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each tasks as task}
                            <td></td>
                            <td></td>

                            <td></td>
                            <td></td>
                            <td><button class="btn btn-primary">To Task</button></td>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bg-base-200">

                asdasdasd
            </div>
        </div>
    </div>
</section>

