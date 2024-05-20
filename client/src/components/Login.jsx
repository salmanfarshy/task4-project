import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";

function Login() {
  const navigate = useNavigate();
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const res = await apiRequest.post("/checkUser", {
        token: localStorage.getItem("token"),
      });
      console.log(res.data);
      if (res.data.Id) {
        return navigate("/");
      }
    };
    checkUser();
    setIsRender(true);
  }, []);

  const loginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await apiRequest.post("/login", {
      email,
      password,
    });
    console.log(res.data);

    if (res.data?.userId) {
      e.target.reset();
      localStorage.removeItem("token");
      localStorage.setItem("token", res.data?.token);
      //return history.push(`/?LoginTime=${res.data.lastLoginTime}`);

      window.history.pushState(
        { data: { LoginTime: res.data.lastLoginTime } },
        "",
        "/"
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    } else if (!res.data?.userId && !res.data?.message)
      alert("You have been blocked.");
    else alert(res.data?.message);
  };

  return (
    <>
      {isRender && (
        <section className="bg-gray-100">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={loginSubmit}>
                  {/*email input*/}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="name@company.com"
                    />
                  </div>

                  {/*password input*/}
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>

                  {/*Login button*/}
                  <button
                    type="submit"
                    className="w-full text-white bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Login
                  </button>
                </form>

                {/*redirect to register*/}
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full fixed bottom-2 text-center text-sm font-medium text-slate-500 ">
            &copy; 2024 Salman Farshy
          </div>
        </section>
      )}
    </>
  );
}

export default Login;
