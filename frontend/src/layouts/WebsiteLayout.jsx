import { Outlet } from "react-router-dom"

export default function WebsiteLayout() {
    return (
        // <div className="flex flex-col min-h-screen">
        //     <header className="border-b p-4">
        //         <h1 className="text-xl font-bold">Public Website</h1>
        //     </header>
        //     <main className="flex-1 p-4">
                <Outlet />
        //     </main>
        //     <footer className="border-t p-4 text-center text-sm text-gray-500">
        //         &copy; 2024 Website
        //     </footer>
        // </div>
    )
}
