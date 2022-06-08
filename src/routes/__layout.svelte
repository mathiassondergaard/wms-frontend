<script>
    import Fa from 'svelte-fa/src/fa.svelte'
    import Notifications from "svelte-notifications";
    import {post} from "$lib/api";
    import { faTasks, faWarehouse, faPeopleGroup, faUser, faArrowRightFromBracket, faLock, faChalkboard, faPaperPlane, faDownload} from '@fortawesome/free-solid-svg-icons'
    import '../app.css';

    const logout = async () => {
        await post('/auth/log-out');
    };

</script>

<div class="navbar">
    <div class="navbar-start">
        <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>
                </svg>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Item 1</a></li>
                <li tabindex="0">
                    <a class="justify-between">
                        Parent
                        <Fa icon={faTasks} />
                    </a>
                    <ul class="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                </li>
                <li><a>Item 3</a></li>
            </ul>
        </div>
        <a class="btn btn-ghost normal-case text-xl">WMS</a>
    </div>
    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal p-0">
            <li tabindex="0">
                <a>
                    <Fa icon={faTasks} />
                    Tasks
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                </a>
                <ul class="p-2">
                    <li>
                        <a><Fa icon={faChalkboard} />Board</a>
                    </li>
                </ul>
            </li>
            <li tabindex="0">
                <a>
                    <Fa icon={faWarehouse} />
                    Inventory
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                </a>
                <ul class="p-2">
                    <li><a><Fa icon={faPaperPlane} />Logs</a></li>
                    <li><a><Fa icon={faDownload} />Downloads</a></li>
                </ul>
            </li>

            <li tabindex="0">
                <a>
                    <Fa icon={faLock} />
                    Manage
                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 24 24">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                </a>
                <ul class="p-2">
                    <li>
                        <a><Fa icon={faPeopleGroup} />Employees</a>
                    </li>
                    <li>
                        <a><Fa icon={faUser} />Users</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="navbar-end">
        <button class="pr-5"><Fa icon={faUser} size="lg"/></button>
        <button class="pr-5" on:click={logout}><Fa icon={faArrowRightFromBracket} size="lg"/></button>
    </div>
</div>

<Notifications>
    <slot/>
</Notifications>


