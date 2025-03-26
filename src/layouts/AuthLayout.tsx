import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false;



  return (
    <div className="bg-gray-900 text-white">
       {isAuthenticated ? (<Navigate to="/" />) :
            <div className="flex">
                <section className="flex flex-1 justify-start items-center flex-col pt-10">
                    <Outlet />
                </section>

                <div className="hidden xl:flex flex-1 object-contain bg-no-repeat h-max">
                <img 
                    src="/assets/images/photo1.jpg"
                    alt="logo"                    
                />
                </div>

            </div>
       } 
    </div>
  )
}

export default AuthLayout