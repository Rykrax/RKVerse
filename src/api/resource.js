// src/api/resource.js
import axiosClient from "../utils/bearerRequest";

class Resource {
  constructor(uri) {
    this.uri = uri;
  }

  list(query) {
    return axiosClient.get(`/${this.uri}`, {
      params: query,
    });
  }

  get(id) {
    return axiosClient.get(`/${this.uri}/${id}`);
  }

  create(data) {
    return axiosClient.post(`/${this.uri}`, data);
  }

  update(id, data) {
    return axiosClient.put(`/${this.uri}/${id}`, data);
  }

  patch(id, data) {
    return axiosClient.patch(`/${this.uri}/${id}`, data);
  }

  delete(id) {
    return axiosClient.delete(`/${this.uri}/${id}`);
  }
}

export default Resource;
