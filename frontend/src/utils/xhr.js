const throwOnFailure = response => {
  if (response.status >= 400) {
    const error = new Error();
    error.status = response.status;
    throw error;
  }

  return response;
};

const headers = {
  "Content-Type": "application/json"
};

const xhr = {
  async get(url) {
    const response = await window.fetch(url, { headers });
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async post(url, body) {
    const response = await window.fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async put(url, body) {
    const response = await window.fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body)
    });
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async delete(url) {
    const response = await window.fetch(url, { headers, method: "DELETE" });
    throwOnFailure(response);

    return true;
  }
};

export default xhr;
