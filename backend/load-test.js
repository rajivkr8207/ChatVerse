import http from "k6/http";

export const options = {
  vus: 100, // 100 users
  duration: "10s",
};

export default function () {
  http.post("http://localhost:8000/api/auth/register");
  http.post("http://localhost:8000/api/auth/login");
  http.get("http://localhost:8000/api/auth/profile");

}