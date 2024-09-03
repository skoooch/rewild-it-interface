const GLOBAL = require("../../Global");
const URI = GLOBAL.BACKEND_URI;
const user_id = "4074e7b2-58e7-49f9-9c53-75ed858eebd5";
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
  const url = `${GLOBAL.BACKEND_URI}${route}`;
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
export async function fetchDataDELETE(route, item) {
  // const session = await fetchSession();
  const url = `${GLOBAL.BACKEND_URI}${route}`;
  const settings = {
    method: "DELETE",
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
 * Helper function to make a server side GET request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 *      token - a JWT token to authorize request in the backend
 */
export async function fetchDataGET(route, item) {
  try {
    const settings = {
      method: "GET",
    };
    let res = null;
    if (route == "pindrop/") {
      res = await fetch(
        `${URI}${route}${"?delta=5&longitude="}${
          item.longitude
        }${"&latitude="}${item.latitude}`,
        settings
      );
    } else {
      res = await fetch(`${URI}${route}`);
    }
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
