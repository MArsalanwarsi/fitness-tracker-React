import { Link } from "react-router-dom"
export default function WebsiteHome() {
    return (
        <div className="max-w-4xl mx-auto py-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to the Website</h2>
            <p className="text-lg text-gray-700">
                This is the public facing part of the application.
                <br />
                <Link to='/profile'>
                  <span className="text-blue-600 hover:underline">Go to Profile</span>
                </Link>
                <br />
                <Link to='/dashboard'>
                  <span className="text-blue-600 hover:underline">Go to Admin Dashboard</span>
                </Link>
            </p>
        </div>
    )
}
