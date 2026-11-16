import { getUsers } from "@/lib/core/servet";



const AdminUserPage = async() => {
    const users = await getUsers()
    console.log(users)
    return (
        <div>
            <h1>Admin User Page</h1>
        </div>
    );
};

export default AdminUserPage;