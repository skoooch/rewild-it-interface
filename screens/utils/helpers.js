import { Platform } from 'react-native';
import axios from 'axios';
import { getAuth, signInWithCustomToken } from '@firebase/auth';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
const GLOBAL = require('../../Global');
const URI = GLOBAL.BACKEND_URI;
const TEST_URI = GLOBAL.LOCAL_URI;

const FIREBASE_API_KEY = 'AIzaSyAV9vA2i86EEGMHY-opLiKuNC_QLPLNPfg';

/**
 * Helper function to make a server side GET request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 *      token - a JWT token to authorize request in the backend
 */
export async function getCustomToken(idToken, userID) {
  try {
    const settings = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    console.log(settings);
    res = await fetch(`${URI}user/${userID}/token`, settings);
    console.log(res.status);
    if (!(199 < res.status && res.status < 300)) {
      const promiseRes = await res.text();
      console.log(`${res.status} ${res.statusText}, Error`);
      throw new Error(`${res.status} ${res.statusText}, Error`);
    }
    try {
      const resJson = await res.json();
      return {
        error: false,
        data: resJson,
        err_message: '',
      };
    } catch (e) {
      const resText = await res.text();
      return resText;
    }
  } catch (error) {
    return {
      error: true,
      data: [],
      err_message: error.message,
    };
  }
}

export async function refreshIdToken(refreshToken) {
  const url = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;
  const settings = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  };

  const response = await fetch(url, settings);
  console.log(response);

  if (response.status == 200) {
    try {
      const resJson = await response.json();
      return resJson;
    } catch (e) {
      const resText = await response.text();
      return resText;
    }
  } else {
    return null;
  }
}

/**
 * Helper function to make a POST request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 *      item - the JSON item being sent
 */
export async function fetchDataLOGIN(route, item) {
  // const session = await fetchSession();
  const url = `${GLOBAL.BACKEND_URI}${route}`;
  console.log(url);
  console.log(item);
  const settings = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(item),
  };
  const response = await fetch(url, settings);
  if (!(199 < response.status && response.status < 300)) {
    const promiseRes = await response.text();
    console.log(`${response.status} ${response.statusText}, Error`);
    throw new Error(`${response.status} ${response.statusText}, Error:`);
  }
  try {
    const resJson = await response.json();
    return resJson;
  } catch (e) {
    const resText = await response.text();
    return resText;
  }
}
export async function fetchDataPOST(route, item) {
  const token = await SecureStore.getItem('accessToken');

  // const session = await fetchSession();
  const url = `${URI}${route}`;
  console.log(url);
  const settings = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token.trim()}`,
    },
    body: JSON.stringify(item),
  };
  console.log(settings);
  const res = await fetch(url, settings);
  if (!(199 < res.status && res.status < 300)) {
    const promiseRes = await res.text();
    console.log(`${res.status} ${res.statusText}, Error`);
    throw new Error(`${res.status} ${res.statusText}, Error:`);
  }
  try {
    const resJson = await res.json();
    return resJson;
  } catch (e) {
    const resText = await res.text();
    return resText;
  }
}
export async function fetchDataIMAGE(route, item) {
  // const session = await fetchSession();
  const auth = getAuth();
  const token = await SecureStore.getItem('accessToken');
  const url = `${URI}${route}`;
  const trimmedURI =
    Platform.OS === 'android' ? item.uri : item.uri.replace('file://', '');
  const fileName = trimmedURI.split('/').pop();

  const formData = new FormData();
  formData.append('image_file', {
    uri: item.uri,
    type: 'image/png',
    name: fileName,
  });
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!(199 < response.status && response.status < 300)) {
    const promiseRes = await response.text();
    console.log(`${response.status} ${response.statusText}, Error`);
    throw new Error(`${response.status} ${response.statusText}, Error:`);
  }
  try {
    const resJson = await response.json();
    return resJson;
  } catch (e) {
    const resText = await response.text();
    return resText;
  }
}

/**
 * Helper function to make a DELETE request. Throws an error if the request fails
 * or if the request returns a non 200 response.
 *
 * Input:
 *      route - a string representing the route from the base URI to send this request
 */
export async function fetchDataDELETE(route, item) {
  // const session = await fetchSession()
  const auth = getAuth();
  console.log('delete');
  const token = await SecureStore.getItem('accessToken');
  const url = `${URI}${route}`;
  const settings = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  };
  const response = await fetch(url, settings);
  if (!(199 < response.status && response.status < 300)) {
    const promiseRes = await response.text();
    console.log(`${response.status} ${response.statusText}, Error`);
    throw new Error(`${response.status} ${response.statusText}, Error:`);
  }
  try {
    const resJson = await response.json();
    return resJson;
  } catch (e) {
    return resText;
  }
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
  const auth = getAuth();
  const token = await SecureStore.getItem('accessToken');
  try {
    const settings = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    res = await fetch(`${URI}${route}`, settings);
    console.log(res);
    if (!(199 < res.status && res.status < 300)) {
      const promiseRes = await res.text();
      console.log(`${res.status} ${res.statusText}, Error`);
      throw new Error(`${res.status} ${res.statusText}, Error`);
    }
    try {
      const resJson = await res.json();
      return {
        error: false,
        data: resJson,
        err_message: '',
      };
    } catch (e) {
      const resText = await res.text();
      return resText;
    }
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
      user: 'Unknown',
      backend_t: undefined,
    };
  }
}
