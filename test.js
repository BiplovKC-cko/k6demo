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
    test: {
      executor: "constant-arrival-rate",
      rate: 10,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 1,
      maxVUs: 10,
    },
    foo: {
      executor: "constant-arrival-rate",
      rate: 15,
      exec: "foo",
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 1,
      maxVUs: 10,
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

export function foo() {
  const result = http.get("https://test-api.k6.io");

  checkResult(result, "foo", 200);
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
