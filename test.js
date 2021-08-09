import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

const failures = new Rate("failed requests");

export const options = {
  ext: {
    loadimpact: {
      projectID: 3456059,
      name: `Biplov Test`,
      note: "Hello world", // this does not work atm
    },
  },
  scenarios: {
    authorize: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        {
          duration: "30s",
          target: 5, // normal
        },
        {
          duration: "10s",
          target: 15, // spike to 15 VUS
        },
        {
          duration: "10s",
          target: 30, // spike to 30 VUs
        },
        {
          duration: "10s",
          target: 5, // bring down to normal
        },
      ],
    },
  },
  thresholds: {
    failed_requests: ["rate<=0"],
    http_req_duration: ["p(95)<500", "p(99)<700"],
  },
};
export default function () {
  const result = http.get("https://test-api.k6.io");

  checkResult(result, "default", 200);
  failures.add(result.status != 200);
}

function checkResult(res, tag, resCode) {
  check(
    res,
    {
      ["status " + tag + " is " + resCode + " (OK)"]: (r) =>
        r.status === resCode,
    },
    { my_tag: tag }
  );
}
