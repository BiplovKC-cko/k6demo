import http from "k6/http";

export default function () {
  const result = http.get("https://test-api.k6.io");
}
