"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: Record<string, unknown>) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.access_token);
    router.push("/dashboard/user");
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <input {...register("email")} placeholder="Email" className="input" />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input"
        /><br />
        <button className="btn-primary">Login</button>
      </form>
    </div>
  );
}
