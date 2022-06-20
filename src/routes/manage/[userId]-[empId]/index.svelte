<script context="module">
    export async function load({fetch, params}) {
        const response = await fetch('http://localhost:3000/api/auth/admin/token/verify', {credentials: "include"});

        if (response.status !== 200) {
            return {
                status: 302,
                redirect: "/login"
            };
        }

        let uid = params.userId;
        let iid = params.empId;

        return {props: {uuid: uid, iid: iid}};
    }
</script>

<script>
    export let uuid;
    export let iid;

    console.log(uuid);
    console.log(iid);
</script>