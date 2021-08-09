import http from "k6/http";
import { check } from "k6";

export default function () {
  const result = http.get("https://test-api.k6.io");

  check(result, {
    "Response code is 200": (r) => r.status === 200,
  });
}
