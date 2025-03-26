import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false;



  return (
    <div className="bg-gray-900 text-white">
       {isAuthenticated ? (<Navigate to="/" />) :
            <div className="flex">
                <section className="flex flex-1 justify-center items-center flex-col py-10">
                    <Outlet />
                </section>

                <img 
                    src="/assets/images/photo1.jpg"
                    alt="logo"
                    className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
                    
                />

            </div>
       } 
    </div>
  )
}

export default AuthLayout