import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false;



  return (
    <div className="bg-gray-900 text-white max-h-full">
       {isAuthenticated ? (<Navigate to="/" />) :
            <div className="flex">
                <section className="flex flex-1 justify-start items-center flex-col py-10 min-h-screen">
                    <Outlet />
                </section>

                <div className="hidden xl:flex flex-1 object-cover bg-no-repeat max-h-full">
                <img 
                    src="/assets/images/Wissen1.jpg"
                    alt="logo"
                    className=""                    
                />
                </div>

            </div>
       } 
    </div>
  )
}

export default AuthLayout