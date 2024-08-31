const GLOBAL = require("../../Global");
const URI = GLOBAL.BACKEND_URI;
/**
 * Helper function to make a POST request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 *      item - the JSON item being sent
 */
export async function fetchDataPOST(route, item) {
  // const session = await fetchSession();
  const url = `${GLOBAL.URI}${route}`;
  const settings = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  };
  const response = await fetch(url, settings);
  if (!(199 < response.status && response.status < 300)) {
    const promiseRes = await response.text();
    const jsonErrMsg = JSON.parse(promiseRes);
    throw new Error(
      `${response.status} ${response.statusText}, Error: ${jsonErrMsg.message}`
    );
  }
  return response;
}

/**
 * Helper function to make a DELETE request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 */
export async function fetchDataDELETE(route) {
  // const session = await fetchSession();
  const url = `${GLOBAL.URI}${route}`;
  const settings = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(url, settings);
  if (!(199 < response.status && response.status < 300)) {
    const promiseRes = await response.text();
    const jsonErrMsg = JSON.parse(promiseRes);
    throw new Error(
      `${response.status} ${response.statusText} Error: ${jsonErrMsg.message}`
    );
  }
  return response;
}

/**
 * Helper function to make a server side GET request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 *      token - a JWT token to authorize request in the backend
 */
export async function fetchDataGET(route, token) {
  try {
    const settings = {
      method: "GET",
    };
    console.log(`${URI}${route}`);
    console.log(settings);
    let res = null;
    if (route == "pindrop/") {
      res = await fetch(`${URI}${route}${"?delta=5&longitude=0&latitude=0"}`);
    } else {
      res = await fetch(`${URI}${route}`, settings);
    }
    console.log(res);
    resJson = await res.json();
    return {
      error: false,
      data: resJson,
      err_message: "",
    };
  } catch (error) {
    return {
      error: true,
      data: [],
      err_message: error.message,
    };
  }
}

// Helper to fetch the current session in the frontend (both client and server components)
export async function fetchSession() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URI}/api/auth/session`
    );
    const session = await res.json();
    return session;
  } catch (err) {
    return {
      user: "Unknown",
      backend_t: undefined,
    };
  }
}
