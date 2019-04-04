const throwOnFailure = response => {
  if (response.status >= 400) {
    const error = new Error();
    error.status = response.status;
    throw error;
  }

  return response;
};

const xhr = {
  async get(url) {
    const response = await window.fetch(url);
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async post(url, body) {
    const response = await window.fetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    });
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async put(url, body) {
    const response = await window.fetch(url, {
      method: "PUT",
      body: JSON.stringify(body)
    });
    const jsonResult = await throwOnFailure(response).json();

    return jsonResult;
  },
  async delete(url) {
    const response = await window.fetch(url, { method: "DELETE" });
    throwOnFailure(response);

    return true;
  }
};

export default xhr;
