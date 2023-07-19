import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return (
        <div>
            <p>Dashboard Page</p>
            <UserButton afterSignOutUrl="/"/>
        </div>
    )
}

export default DashboardPage;