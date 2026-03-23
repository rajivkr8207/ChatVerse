import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VerifyEmailApi } from "../services/auth.service";

const VerifyEmail = () => {
  const {token} = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await VerifyEmailApi(token);
        if (res.success) {
          setStatus("success");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    if (token) verifyEmail();
    else setStatus("error");
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-[350px]">

        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">Please wait</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-green-600 text-xl font-semibold mb-2">
              Email Verified ✅
            </h2>
            <p className="text-gray-500">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-red-600 text-xl font-semibold mb-2">
              Verification Failed ❌
            </h2>
            <p className="text-gray-500">
              Invalid or expired link
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;